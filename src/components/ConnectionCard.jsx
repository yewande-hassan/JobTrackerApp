import "../styles/ConnectionCard.css";
import { IoClose } from "react-icons/io5";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";
import { deleteConnection } from "../services/connectionsServices";

const ConnectionCard = ({ data, onClick }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <div className="card" onClick={() => { if (!confirmOpen) onClick?.(); }}>
        <div className="card-heading">
          <div className="job-info">
            <p className="company">{data.name}</p>
            <p className="role">{data.company}</p>
            <p className="date">{data.metAt || data.role}</p>
          </div>
          <p
            className={`match ${
              data.status === "Connected"
                ? "status-connected"
                : data.status === "Waiting"
                ? "status-waiting"
                : data.status === "Follow up"
                ? "status-followup"
                : data.status === "No response"
                ? "status-noresponse"
                : ""
            }`}
          >
            {data.status}
          </p>
        </div>
        <p className="note"><span className="note-color">Note:</span> {data.note}</p>

        <button
          className="card-delete"
          aria-label="Delete connection"
          onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }}
        >
          <IoClose />
        </button>
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Delete Connection"
          message="Are you sure you want to delete this connection?"
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            try {
              await deleteConnection(data.id);
            } finally {
              setConfirmOpen(false);
            }
          }}
        />
      </div>
    </>
  );
};

export default ConnectionCard;
