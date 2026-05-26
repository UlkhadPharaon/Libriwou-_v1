import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface LocalNotificationAlert {
  id: number;
  title: string;
  body: string;
  scheduleAt: Date;
  extraData?: any;
}

class NotificationService {
  private isNative: boolean;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    console.log(`[Notification Service] Running on native platform: ${this.isNative}`);
  }

  /**
   * Request permissions for sending notifications.
   */
  async requestPermissions(): Promise<boolean> {
    if (this.isNative) {
      try {
        const status = await LocalNotifications.checkPermissions();
        if (status.display !== 'granted') {
          const reqStatus = await LocalNotifications.requestPermissions();
          return reqStatus.display === 'granted';
        }
        return true;
      } catch (e) {
        console.error("[Notification Service] Error requesting native permissions:", e);
        return false;
      }
    } else {
      // Browser Web Notifications fallback
      if (!('Notification' in window)) {
        console.warn("[Notification Service] Web notifications not supported in this browser.");
        return false;
      }

      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return true;
    }
  }

  /**
   * Schedule a future local notification.
   */
  async scheduleNotification(alert: LocalNotificationAlert): Promise<boolean> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      console.warn("[Notification Service] Permission non accordée. Notification annulée.");
      return false;
    }

    if (this.isNative) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: alert.id,
              title: alert.title,
              body: alert.body,
              schedule: { at: alert.scheduleAt },
              smallIcon: 'ic_stat_icon_config_sample', // falls back to app default
              iconColor: '#D4AF37',
              extra: alert.extraData || {}
            }
          ]
        });
        console.log(`[Notification Service] Native notification scheduled for ${alert.scheduleAt}: ${alert.title}`);
        return true;
      } catch (e) {
        console.error("[Notification Service] Error scheduling native notification:", e);
        return false;
      }
    } else {
      // Browser fallback (simulate using setTimeout if time is soon, or log)
      const delay = alert.scheduleAt.getTime() - Date.now();
      console.log(`[Notification Service] Browser notification planned in ${Math.round(delay / 1000)}s: ${alert.title}`);

      if (delay > 0) {
        setTimeout(() => {
          new Notification(alert.title, {
            body: alert.body,
            icon: '/pwa-192x192.svg'
          });
        }, delay);
        return true;
      }
      return false;
    }
  }

  /**
   * Send a notification instantly.
   */
  async sendInstantNotification(title: string, body: string) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    if (this.isNative) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: Math.floor(Math.random() * 100000),
              title,
              body,
              iconColor: '#D4AF37'
            }
          ]
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.svg'
      });
    }
  }

  /**
   * Clear all scheduled notifications.
   */
  async clearAllNotifications() {
    if (this.isNative) {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel(pending);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const notificationService = new NotificationService();
