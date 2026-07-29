import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  const getToastStyle = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return { background: '#3fb950' };
      case 'error':
        return { background: '#f85149' };
      case 'info':
        return { background: '#58a6ff' };
    }
  };

  return (
    <div style={styles.container}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            ...getToastStyle(toast.type)
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as const,
    top: '80px',
    right: '24px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '10px',
    zIndex: 999
  },
  toast: {
    padding: '14px 24px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    animation: 'slideInRight 0.3s ease'
  }
};
