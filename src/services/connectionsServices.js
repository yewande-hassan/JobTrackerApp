import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "connections";

export async function addConnection(payload, currentUser) {
  if (!currentUser?.uid) throw new Error("Not authenticated");
  const date = new Date();
  const createdAt = date.toISOString();
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: payload.name || "",
    company: payload.company || "",
    metAt: payload.metAt || "",
    status: payload.status || "Waiting",
    note: payload.note || "",
    userId: currentUser.uid,
    createdAt,
    updatedAt: createdAt,
  });
  return docRef;
}

export function subscribeConnections(currentUser, callback) {
  if (!currentUser?.uid) return () => {};
  const q = query(collection(db, COLLECTION), where("userId", "==", currentUser.uid));
  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
  return unsub;
}

export async function fetchConnections(currentUser) {
  if (!currentUser?.uid) return [];
  const q = query(collection(db, COLLECTION), where("userId", "==", currentUser.uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateConnection(id, updates) {
  const ref = doc(db, COLLECTION, id);
  const payload = { ...updates, updatedAt: new Date().toISOString() };
  await updateDoc(ref, payload);
  return true;
}

export async function deleteConnection(id) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
