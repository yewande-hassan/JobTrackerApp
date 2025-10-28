import { collection, onSnapshot, query, where, orderBy, updateDoc, doc, addDoc, getDocs, deleteDoc } from "firebase/firestore";
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
