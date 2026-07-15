"use client";

import { ReactNode } from "react";

export default function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="modal-mask"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
