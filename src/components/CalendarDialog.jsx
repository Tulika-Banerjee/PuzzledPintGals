import React, { useLayoutEffect, useRef } from 'react';

export default function CalendarDialog({ label, className = '', onClose, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog.showModal();
    dialog.querySelector('.gallery-close').focus();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={`gallery-overlay ${className}`}
      aria-label={label}
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
    >
      {children}
    </dialog>
  );
}
