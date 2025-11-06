import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Notifications.css";
import { useAuth } from "../context/AuthContext";
import { subscribeNotificationsLimited, fetchNotificationsPage, markAllAsRead, markAsRead, deleteNotification } from "../services/notificationsService";
import ConfirmDialog from "../components/ConfirmDialog";
import { IoClose } from "react-icons/io5";

function timeAgo(ts){
  if (!ts) return "";
  const now = Date.now();
  const diff = Math.max(0, now - (typeof ts === 'number' ? ts : new Date(ts).getTime()));
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} ${mins===1?"min":"mins"} ago`;
  const hrs = Math.floor(mins/60);
  if (hrs < 24) return `${hrs} ${hrs===1?"hour":"hours"} ago`;
  const days = Math.floor(hrs/24);
  return `${days} ${days===1?"day":"days"} ago`;
}

export default function Notifications(){
  const { currentUser } = useAuth();
  const [liveItems, setLiveItems] = useState([]); // first page, live
  const [olderItems, setOlderItems] = useState([]); // subsequent pages, non-live
  const [lastRef, setLastRef] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    // Live subscription for the newest notifications (first page)
    const PAGE_SIZE = 20;
    const unsub = subscribeNotificationsLimited(currentUser, PAGE_SIZE, (docs) => {
      setLiveItems(docs);
      // If we haven't loaded older pages yet, keep lastRef synced to the live page tail
      if (olderItems.length === 0) {
        setLastRef(docs.length ? docs[docs.length - 1]._ref : null);
      }
      // Determine if end reached only if we have no older pages loaded yet
      if (olderItems.length === 0) {
        setEndReached(docs.length < PAGE_SIZE);
      }
    });
    return () => unsub && unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const items = useMemo(() => {
    // merge live first page and older pages, dedupe by id, maintain order (live first)
    const map = new Map();
    for (const it of [...liveItems, ...olderItems]) {
      if (!map.has(it.id)) map.set(it.id, it);
    }
    return Array.from(map.values());
  }, [liveItems, olderItems]);

  const unreadCount = useMemo(() => items.filter(i => !i.read).length, [items]);

  const loadMore = async () => {
    if (loadingMore || endReached) return;
    setLoadingMore(true);
    try {
      const PAGE_SIZE = 20;
      const { items: next, last } = await fetchNotificationsPage(currentUser, lastRef, PAGE_SIZE);
      if (next.length === 0) {
        setEndReached(true);
        return;
      }
      setOlderItems((prev) => [...prev, ...next]);
      setLastRef(last);
      if (next.length < PAGE_SIZE) setEndReached(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <h1 className="notif-title">Notifications</h1>
            <p className="notif-subtitle">You have {unreadCount} unread notification{unreadCount===1?"":"s"}</p>
          </div>
          <button className="btn-mark-all" onClick={() => markAllAsRead(currentUser)} disabled={!unreadCount}>Mark All as Read</button>
        </div>

        <div className="notif-panel">
          {items.length === 0 ? (
            <p className="empty">No notifications yet.</p>
          ) : (
            items.map((n) => (
              <div key={n.id} className={`notif-item ${n.read ? "read" : "unread"}`} onClick={() => !n.read && markAsRead(n.id)}>
                <div className="notif-content">
                  <h3 className="notif-item-title">{n.title}</h3>
                  <p className="notif-item-body">{n.body}</p>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </div>
                <span className={`notif-dot ${n.read ? "hidden" : ""}`} aria-hidden />
                <button
                  className="notif-delete"
                  aria-label="Delete notification"
                  onClick={(e) => { e.stopPropagation(); setConfirmId(n.id); }}
                >
                  <IoClose />
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && !endReached && (
          <div className="notif-load-more">
            <button className="btn-mark-all" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
        <ConfirmDialog
          isOpen={!!confirmId}
          title="Delete Notification"
          message="Are you sure you want to delete this notification?"
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onCancel={() => setConfirmId(null)}
          onConfirm={async () => { try { if (confirmId) await deleteNotification(confirmId); } finally { setConfirmId(null); } }}
        />
      </div>
    </div>
  );
}
