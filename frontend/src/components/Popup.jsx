import React, { useEffect } from 'react';

const Popup = ({ isOpen, onClose, type = 'info', title, message, autoClose = false, autoCloseTime = 3000 }) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseTime, onClose]);

  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: { backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724' },
          icon: '✅'
        };
      case 'error':
        return {
          container: { backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24' },
          icon: '❌'
        };
      case 'warning':
        return {
          container: { backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', color: '#856404' },
          icon: '⚠️'
        };
      default:
        return {
          container: { backgroundColor: '#d1ecf1', border: '1px solid #bee5eb', color: '#0c5460' },
          icon: 'ℹ️'
        };
    }
  };

  const styles = getStyles();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '0',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        animation: 'popupFadeIn 0.3s ease-out'
      }}>
        {/* Header with colored bar */}
        <div style={{
          ...styles.container,
          padding: '15px 20px',
          borderRadius: '8px 8px 0 0',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>{styles.icon}</span>
          <span>{title}</span>
        </div>

        {/* Message body */}
        <div style={{
          padding: '20px',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {message}
        </div>

        {/* Footer with close button */}
        <div style={{
          padding: '15px 20px',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'flex-end',
          borderRadius: '0 0 8px 8px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            OK
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes popupFadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Popup;