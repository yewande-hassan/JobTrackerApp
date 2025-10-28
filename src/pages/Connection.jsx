import { useEffect, useState } from "react";
import ConnectionCard from "../components/ConnectionCard";
import ConnectionForm from "../components/ConnectionForm";
import Modal from "../components/Modal";
import Navbar from "../components/Navbar";
import "../styles/Connection.css";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { addConnection, subscribeConnections, updateConnection } from "../services/connectionsServices";
import { addNotification } from "../services/notificationsService";

function Connection() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // holds connection object when editing
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeConnections(currentUser, setConnections);
    return () => unsub && unsub();
  }, [currentUser]);

  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (conn) => { setEditing(conn); setShowForm(true); };
  const closeForm = () => { setEditing(null); setShowForm(false); };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      if (editing?.id) {
        await updateConnection(editing.id, values);
        if (editing.status !== values.status) {
          try {
            await addNotification(currentUser, {
              title: "Connection updated",
              body: `${values.name || editing.name}: status changed to ${values.status}.`
            });
          } catch { /* ignore */ }
        }
      } else {
        await addConnection(values, currentUser);
        try {
          await addNotification(currentUser, {
            title: "New connection added",
            body: `${values.name || "A connection"} at ${values.company || "an organization"}`
          });
        } catch { /* ignore */ }
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="connection-container">
        <div className="connection-header">
          <p className="heading">Networking Tracker</p>
          <button type="button" className="btn-connection" onClick={openNew}>
            <FaPlus className="plus-btn" />
            New Connection
          </button>
        </div>
        <p className="text">
          Keep track of the people you’ve connected with, follow up on
          opportunities, and grow your professional network easily.
        </p>
        <Modal
          isOpen={showForm}
          title={editing ? "Edit Connection" : "New Connection"}
          onClose={closeForm}
        >
          <ConnectionForm
            initialValues={editing}
            saving={saving}
            onCancel={closeForm}
            onSave={handleSave}
          />
        </Modal>
        {connections.map((c) => (
          <ConnectionCard key={c.id} data={c} onClick={() => openEdit(c)} />
        ))}
      </div>
    </div>
  );
}

export default Connection