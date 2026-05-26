/**
 * Mock local-first firebase/auth implementation.
 */

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string;
  tenantId?: string | null;
  providerData?: {
    providerId: string;
    email: string;
  }[];
}

const STORAGE_KEY = "neocompta_logged_in_user";
const LICENSE_KEY = "neocompta_subscription_metadata";

// Default mock user
const defaultUser: MockUser = {
  uid: "sovereign-local-user",
  email: "directeur@neocompta.local",
  displayName: "Directeur Général",
  emailVerified: true,
  isAnonymous: false,
  photoURL: "/mascot.jpg",
  tenantId: null,
  providerData: [{ providerId: "google.com", email: "directeur@neocompta.local" }]
};

class MockAuth {
  private listeners: ((user: MockUser | null) => void)[] = [];
  private currentUserObj: MockUser | null = null;

  constructor() {
    // Load persisted session
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (persisted) {
      try {
        this.currentUserObj = JSON.parse(persisted);
      } catch (e) {
        this.currentUserObj = null;
      }
    }
  }

  get currentUser(): MockUser | null {
    return this.currentUserObj;
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    // Trigger immediately with current state
    setTimeout(() => {
      callback(this.currentUserObj);
    }, 0);

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async mockSignIn(email: string = "directeur@neocompta.local", name: string = "Directeur Général") {
    const user: MockUser = {
      uid: "sovereign-local-user", // Keep consistent local UID
      email,
      displayName: name,
      emailVerified: true,
      isAnonymous: false,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      tenantId: null,
      providerData: [{ providerId: "google.com", email }]
    };

    this.currentUserObj = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    // Fetch and cache subscription status from local mock license server
    await this.refreshSubscription(user.email);

    this.triggerListeners();
    return user;
  }

  async mockSignOut() {
    this.currentUserObj = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LICENSE_KEY);
    this.triggerListeners();
  }

  private triggerListeners() {
    this.listeners.forEach(callback => callback(this.currentUserObj));
  }

  /**
   * Hybrid License verification call
   */
  async refreshSubscription(email: string): Promise<{ active: boolean; expiry: string }> {
    try {
      // In production, this would be your remote secure billing server.
      // We will perform a fetch to the backend Express server, with a fallback if offline.
      const res = await fetch("/api/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(LICENSE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn("[Local Auth] Mode hors-ligne: impossible de contacter le serveur de licence. Utilisation du cache.");
    }

    // Offline / fallback: check cached metadata
    const cached = localStorage.getItem(LICENSE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }

    // Default demo licence: 30 days active if never fetched
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    const mockLicense = { active: true, expiry: defaultExpiry.toISOString() };
    localStorage.setItem(LICENSE_KEY, JSON.stringify(mockLicense));
    return mockLicense;
  }

  getSubscriptionMetadata() {
    const cached = localStorage.getItem(LICENSE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    // Return default active 30d
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    return { active: true, expiry: defaultExpiry.toISOString() };
  }
}

export const authInstance = new MockAuth();

export function getAuth() {
  return authInstance;
}

export function onAuthStateChanged(auth: any, callback: (user: any | null) => void) {
  return authInstance.onAuthStateChanged(callback);
}

export class GoogleAuthProvider {
  static PROVIDER_ID = 'google.com';
}

export async function signInWithPopup(auth: any, provider: any) {
  console.log("[Local Auth] Connexion simulée avec Google...");
  return {
    user: await authInstance.mockSignIn()
  };
}

export async function signOut(auth: any) {
  console.log("[Local Auth] Déconnexion locale...");
  await authInstance.mockSignOut();
}
