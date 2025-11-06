import { collection, onSnapshot, query, where, orderBy, updateDoc, doc, addDoc, getDocs, deleteDoc, limit, startAfter } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "notifications";

export function subscribeNotifications(currentUser, callback) {
  if (!currentUser?.uid) return () => {};
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", currentUser.uid),
    orderBy("createdAt", "desc")
  );
  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
  return unsub;
}

// Lightweight presence subscription for Navbar: only checks if any unread exists
export function subscribeUnreadPresence(currentUser, onHasUnread) {
  if (!currentUser?.uid) return () => {};
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", currentUser.uid),
    where("read", "==", false),
    limit(1)
  );
  const unsub = onSnapshot(q, (snap) => {
    onHasUnread(!snap.empty);
  });
  return unsub;
}

// Limited subscription for the Notifications page first page
export function subscribeNotificationsLimited(currentUser, pageSize, callback) {
  if (!currentUser?.uid) return () => {};
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", currentUser.uid),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );
  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data(), _ref: d }));
    callback(items);
  });
  return unsub;
}

// Fetch the next page after the given last document (non-live)
export async function fetchNotificationsPage(currentUser, lastDocRef, pageSize) {
  if (!currentUser?.uid) return { items: [], last: null };
  const base = [
    collection(db, COLLECTION),
    where("userId", "==", currentUser.uid),
    orderBy("createdAt", "desc"),
  ];
  const q = lastDocRef
    ? query(...base, startAfter(lastDocRef), limit(pageSize))
    : query(...base, limit(pageSize));
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data(), _ref: d }));
  const last = snap.docs[snap.docs.length - 1] || null;
  return { items: docs, last };
}

export async function markAllAsRead(currentUser) {
  if (!currentUser?.uid) return;
  const q = query(collection(db, COLLECTION), where("userId", "==", currentUser.uid), where("read", "==", false));
  const snap = await getDocs(q);
  const batch = [];
  for (const d of snap.docs) {
    batch.push(updateDoc(doc(db, COLLECTION, d.id), { read: true }));
  }
  await Promise.all(batch);
}

export async function markAsRead(id) {
  await updateDoc(doc(db, COLLECTION, id), { read: true });
}

// Utility for seeding/testing notifications
export async function addNotification(currentUser, { title, body }) {
  if (!currentUser?.uid) throw new Error("auth required");
  return addDoc(collection(db, COLLECTION), {
    userId: currentUser.uid,
    title,
    body,
    read: false,
    createdAt: Date.now(),
  });
}

export async function deleteNotification(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
