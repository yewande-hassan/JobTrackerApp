import React from "react";
import "../styles/Confirm.css";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
      <div className="confirm-modal" onClick={(e)=>e.stopPropagation()}>
        <button className="close-x" aria-label="Close" onClick={(e)=>{ e.stopPropagation(); onCancel(); }}>
          ×
        </button>
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={(e)=>{ e.stopPropagation(); onCancel(); }}>{cancelText}</button>
          <button
            className={`btn-confirm ${variant === "danger" ? "danger" : "primary"}`}
            onClick={(e)=>{ e.stopPropagation(); onConfirm(); }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
