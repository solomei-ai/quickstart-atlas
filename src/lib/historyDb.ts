import type {HistoryEntry} from '../components/History/history.ts';

const DB_NAME = 'atlas';
const STORE_NAME = 'history';
const DB_VERSION = 1;

// Opened lazily and memoised: every call shares the same connection.
let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
	if (dbPromise) return dbPromise;
	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				// Keyed by the story id (minted by STORY_CREATED). The `by-date`
				// index lets reads come back chronological without sorting in JS —
				// `date` is stored as an ISO string, whose lexical order is its
				// chronological order.
				const store = db.createObjectStore(STORE_NAME, {keyPath: 'id'});
				store.createIndex('by-date', 'date');
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
	return dbPromise;
}

/** Runs one operation in a transaction and resolves with its result once committed. */
function runTx<T>(
	mode: IDBTransactionMode,
	op: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
	return openDb().then(db => new Promise<T>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, mode);
		const request = op(tx.objectStore(STORE_NAME));
		tx.oncomplete = () => resolve(request.result);
		tx.onerror = () => reject(tx.error);
		tx.onabort = () => reject(tx.error);
	}));
}

/** Insert or update an entry (upsert by `id`). */
export function putHistoryEntry(entry: HistoryEntry): Promise<void> {
	return runTx('readwrite', store => store.put(entry)).then(() => undefined);
}

/** All entries in chronological order (oldest first). */
export function getAllHistoryEntries(): Promise<HistoryEntry[]> {
	return runTx('readonly', store => store.index('by-date').getAll());
}

/** A single entry by story id, or `undefined` if it hasn't been stored yet. */
export function getHistoryEntry(id: string): Promise<HistoryEntry | undefined> {
	return runTx('readonly', store => store.get(id));
}

/** Remove every stored entry. */
export function clearHistoryEntries(): Promise<void> {
	return runTx('readwrite', store => store.clear()).then(() => undefined);
}
