import React from "react";
import "../styles/Card.css";

function ProfileCard({ title, children, actionLabel, onAction }) {
  return (
    <div className="card profile-card">
      {title && <h3 className="profile-card-title">{title}</h3>}
      <div className="profile-card-content">
        {children}
      </div>
      {actionLabel && onAction && (
        <button className="btn-primary" onClick={onAction} style={{ marginTop: 16 }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ProfileCard;
