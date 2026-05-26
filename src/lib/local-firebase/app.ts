/**
 * Mock local-first firebase/app implementation.
 */

export function initializeApp(config: any) {
  console.log("[Local Firebase] Initializing local database with config", config);
  return {
    name: "[DEFAULT]",
    options: config,
    automaticDataCollectionEnabled: false
  };
}
