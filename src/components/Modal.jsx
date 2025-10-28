import React from "react";
import "../styles/Confirm.css";

export default function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="confirm-modal" onClick={(e)=>e.stopPropagation()}>
        <button className="close-x" aria-label="Close" onClick={(e)=>{ e.stopPropagation(); onClose?.(); }}>×</button>
        {title ? <h2 className="confirm-title" style={{ textAlign: "center" }}>{title}</h2> : null}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
