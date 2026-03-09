import React, { createContext, useContext, useState } from 'react';
import Popup from '../components/Popup';

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    autoClose: false,
    autoCloseTime: 3000
  });

  const showPopup = (type, title, message, autoClose = false, autoCloseTime = 3000) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
      autoClose,
      autoCloseTime
    });
  };

  const hidePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  // Convenience methods for different types
  const showSuccess = (title, message, autoClose = true) => {
    showPopup('success', title, message, autoClose);
  };

  const showError = (title, message, autoClose = false) => {
    showPopup('error', title, message, autoClose);
  };

  const showWarning = (title, message, autoClose = false) => {
    showPopup('warning', title, message, autoClose);
  };

  const showInfo = (title, message, autoClose = false) => {
    showPopup('info', title, message, autoClose);
  };

  return (
    <PopupContext.Provider value={{
      showSuccess,
      showError,
      showWarning,
      showInfo,
      hidePopup
    }}>
      {children}
      <Popup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        autoClose={popup.autoClose}
        autoCloseTime={popup.autoCloseTime}
      />
    </PopupContext.Provider>
  );
};