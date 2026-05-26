/**
 * Mock local-first firebase/firestore implementation.
 * Stores data entirely on-device using LocalStorage for maximum simplicity, reliability, and speed.
 */

// Simple Timestamp class mock
export class Timestamp {
  constructor(public seconds: number, public nanoseconds: number) {}

  static now() {
    const ms = Date.now();
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }

  static fromDate(date: Date) {
    const ms = date.getTime();
    return new Timestamp(Math.floor(ms / 1000), (ms % 1000) * 1000000);
  }

  toDate() {
    return new Date(this.seconds * 1000 + Math.floor(this.nanoseconds / 1000000));
  }

  toMillis() {
    return this.seconds * 1000 + Math.floor(this.nanoseconds / 1000000);
  }

  toISOString() {
    return this.toDate().toISOString();
  }

  valueOf() {
    return this.toMillis();
  }
}

// Interfaces
export class DocumentReference {
  constructor(public id: string, public path: string, public parent: any) {}
}

export class CollectionReference {
  constructor(public id: string, public path: string) {}
}

export class DocumentSnapshot {
  constructor(
    public id: string,
    private _data: any,
    public ref: DocumentReference,
    public existsFlag: boolean
  ) {}

  exists() {
    return this.existsFlag;
  }

  data() {
    return this._data ? { ...this._data } : undefined;
  }
}

export class QuerySnapshot {
  constructor(public docs: DocumentSnapshot[]) {}
  
  get size() {
    return this.docs.length;
  }

  get empty() {
    return this.docs.length === 0;
  }

  forEach(callback: (doc: DocumentSnapshot) => void) {
    this.docs.forEach(callback);
  }
}

// Database Engine
const DB_STORAGE_KEY = "neocompta_sovereign_db";

interface DBStructure {
  [collectionName: string]: {
    [docId: string]: any;
  };
}

class LocalDBEngine {
  private db: DBStructure = {};
  private listeners: { [id: string]: { path: string; isDoc: boolean; callback: (snap: any) => void; queryConstraints?: any[] } } = {};
  private listenerIdCounter = 0;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) {
      try {
        this.db = JSON.parse(raw);
      } catch (e) {
        console.error("[Local DB] Failed to parse local database. Resetting.", e);
        this.db = {};
      }
    } else {
      this.db = {};
    }
  }

  private saveToStorage() {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.db));
  }

  // Database operations
  async getDoc(path: string, id: string): Promise<DocumentSnapshot> {
    this.loadFromStorage(); // Always sync latest
    const collection = this.db[path] || {};
    const data = collection[id];
    const ref = new DocumentReference(id, `${path}/${id}`, new CollectionReference(path, path));
    return new DocumentSnapshot(id, data, ref, data !== undefined);
  }

  async setDoc(path: string, id: string, data: any, options?: { merge?: boolean }) {
    this.loadFromStorage();
    if (!this.db[path]) this.db[path] = {};
    
    // Process serverTimestamp
    const cleanData = this.sanitizeData(data);

    if (options?.merge && this.db[path][id]) {
      this.db[path][id] = { ...this.db[path][id], ...cleanData };
    } else {
      this.db[path][id] = cleanData;
    }
    
    this.saveToStorage();
    this.triggerListenersForPath(path, id);
  }

  async addDoc(path: string, data: any): Promise<DocumentReference> {
    const id = "local_doc_" + Math.random().toString(36).substring(2, 15);
    await this.setDoc(path, id, data);
    return new DocumentReference(id, `${path}/${id}`, new CollectionReference(path, path));
  }

  async updateDoc(path: string, id: string, data: any) {
    this.loadFromStorage();
    if (this.db[path] && this.db[path][id]) {
      const cleanData = this.sanitizeData(data);
      this.db[path][id] = { ...this.db[path][id], ...cleanData };
      this.saveToStorage();
      this.triggerListenersForPath(path, id);
    } else {
      throw new Error(`[Local DB] Document ${path}/${id} non trouvé pour mise à jour.`);
    }
  }

  async deleteDoc(path: string, id: string) {
    this.loadFromStorage();
    if (this.db[path] && this.db[path][id]) {
      delete this.db[path][id];
      this.saveToStorage();
      this.triggerListenersForPath(path, id);
    }
  }

  async getDocs(path: string, constraints?: any[]): Promise<QuerySnapshot> {
    this.loadFromStorage();
    const collection = this.db[path] || {};
    let docs = Object.keys(collection).map(id => {
      const ref = new DocumentReference(id, `${path}/${id}`, new CollectionReference(path, path));
      return new DocumentSnapshot(id, collection[id], ref, true);
    });

    if (constraints && constraints.length > 0) {
      docs = this.applyConstraints(docs, constraints);
    }

    return new QuerySnapshot(docs);
  }

  // Register real-time listener
  subscribe(path: string, isDoc: boolean, callback: (snap: any) => void, constraints?: any[]): string {
    const listenerId = "listener_" + (++this.listenerIdCounter);
    this.listeners[listenerId] = { path, isDoc, callback, queryConstraints: constraints };
    
    // Initial trigger
    setTimeout(async () => {
      if (isDoc) {
        // Doc path is e.g. "companies/uid", let's split it
        const parts = path.split('/');
        const col = parts[0];
        const docId = parts[1];
        const snap = await this.getDoc(col, docId);
        callback(snap);
      } else {
        const snap = await this.getDocs(path, constraints);
        callback(snap);
      }
    }, 0);

    return listenerId;
  }

  unsubscribe(listenerId: string) {
    delete this.listeners[listenerId];
  }

  private triggerListenersForPath(colPath: string, docId: string) {
    // Notify collection and specific doc listeners
    Object.keys(this.listeners).forEach(async (id) => {
      const l = this.listeners[id];
      if (!l) return;

      if (l.isDoc) {
        const parts = l.path.split('/');
        if (parts[0] === colPath && parts[1] === docId) {
          const snap = await this.getDoc(colPath, docId);
          l.callback(snap);
        }
      } else if (l.path === colPath) {
        const snap = await this.getDocs(colPath, l.queryConstraints);
        l.callback(snap);
      }
    });
  }

  private applyConstraints(docs: DocumentSnapshot[], constraints: any[]): DocumentSnapshot[] {
    let filtered = [...docs];

    // Filter by 'where' clauses
    const whereClauses = constraints.filter(c => c.type === 'where');
    whereClauses.forEach(clause => {
      const { field, op, value } = clause;
      filtered = filtered.filter(docSnap => {
        const data = docSnap.data();
        if (!data) return false;
        const val = data[field];

        if (op === '==') return val === value;
        if (op === '!=') return val !== value;
        if (op === '>') return val > value;
        if (op === '>=') return val >= value;
        if (op === '<') return val < value;
        if (op === '<=') return val <= value;
        if (op === 'array-contains') return Array.isArray(val) && val.includes(value);
        return true;
      });
    });

    // Filter / sort by 'orderBy' clauses
    const orderClauses = constraints.filter(c => c.type === 'orderBy');
    orderClauses.forEach(clause => {
      const { field, direction } = clause;
      filtered.sort((a, b) => {
        const valA = a.data()?.[field];
        const valB = b.data()?.[field];
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        
        let comparison = 0;
        if (valA < valB) comparison = -1;
        if (valA > valB) comparison = 1;

        return direction === 'desc' ? -comparison : comparison;
      });
    });

    return filtered;
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    const clean = { ...data };
    
    // Replace serverTimestamp() or firebase special values with local values
    Object.keys(clean).forEach(k => {
      if (clean[k] && typeof clean[k] === 'object') {
        // If it's a mock timestamp helper or special value
        if (clean[k]._methodName === 'serverTimestamp') {
          clean[k] = Timestamp.now();
        }
      }
    });
    return clean;
  }
}

export const dbInstance = new LocalDBEngine();

// Firebase SDK Compatibility exports
export function initializeFirestore(app: any, settings: any, databaseId?: string) {
  console.log("[Local Firestore] Running local-first database...");
  return dbInstance;
}

export function getFirestore() {
  return dbInstance;
}

// Helpers
export function doc(db: any, collectionName: string, docId?: string) {
  // Support both doc(db, 'col', 'id') and doc(collectionRef, 'id')
  if (collectionName.includes('/')) {
    const parts = collectionName.split('/');
    return new DocumentReference(parts[1], collectionName, new CollectionReference(parts[0], parts[0]));
  }
  const actualId = docId || "local_doc_" + Math.random().toString(36).substring(2, 15);
  return new DocumentReference(actualId, `${collectionName}/${actualId}`, new CollectionReference(collectionName, collectionName));
}

export function collection(db: any, collectionName: string) {
  return new CollectionReference(collectionName, collectionName);
}

export async function getDoc(docRef: DocumentReference): Promise<DocumentSnapshot> {
  const parts = docRef.path.split('/');
  return dbInstance.getDoc(parts[0], parts[1]);
}

export async function getDocFromServer(docRef: DocumentReference): Promise<DocumentSnapshot> {
  return getDoc(docRef); // local is always server for offline
}

export async function setDoc(docRef: DocumentReference, data: any, options?: any) {
  const parts = docRef.path.split('/');
  return dbInstance.setDoc(parts[0], parts[1], data, options);
}

export async function addDoc(colRef: CollectionReference, data: any): Promise<DocumentReference> {
  return dbInstance.addDoc(colRef.path, data);
}

export async function updateDoc(docRef: DocumentReference, data: any) {
  const parts = docRef.path.split('/');
  return dbInstance.updateDoc(parts[0], parts[1], data);
}

export async function deleteDoc(docRef: DocumentReference) {
  const parts = docRef.path.split('/');
  return dbInstance.deleteDoc(parts[0], parts[1]);
}

export async function getDocs(queryObj: any): Promise<QuerySnapshot> {
  if (queryObj instanceof CollectionReference) {
    return dbInstance.getDocs(queryObj.path);
  }
  // If it's a query object
  return dbInstance.getDocs(queryObj.path, queryObj.constraints);
}

export function query(colRef: CollectionReference, ...constraints: any[]) {
  return {
    path: colRef.path,
    constraints: constraints
  };
}

export function where(field: string, op: string, value: any) {
  return { type: 'where', field, op, value };
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
  return { type: 'orderBy', field, direction };
}

export function onSnapshot(target: any, callback: (snap: any) => void) {
  const isDoc = target instanceof DocumentReference;
  const path = target.path;
  const constraints = target.constraints;

  const listenerId = dbInstance.subscribe(path, isDoc, callback, constraints);
  return () => {
    dbInstance.unsubscribe(listenerId);
  };
}

export function writeBatch(db: any) {
  const operations: (() => Promise<void>)[] = [];
  return {
    set(docRef: DocumentReference, data: any, options?: any) {
      operations.push(() => setDoc(docRef, data, options));
    },
    update(docRef: DocumentReference, data: any) {
      operations.push(() => updateDoc(docRef, data));
    },
    delete(docRef: DocumentReference) {
      operations.push(() => deleteDoc(docRef));
    },
    async commit() {
      for (const op of operations) {
        await op();
      }
    }
  };
}

export function arrayUnion(...elements: any[]) {
  // Simple helper representation for batch array unions in memory
  return elements;
}

export function serverTimestamp() {
  return { _methodName: 'serverTimestamp' };
}

// Additional configurations required by some Firebase utils
export function persistentLocalCache(options: any) { return {}; }
export function persistentMultipleTabManager() { return {}; }
