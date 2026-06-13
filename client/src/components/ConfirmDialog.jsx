import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    resolve: null,
    reject: null,
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve, reject) => {
      setConfirmState({
        isOpen: true,
        message,
        resolve,
        reject,
      });
    });
  }, []);

  const handleConfirm = () => {
    confirmState.resolve(true);
    setConfirmState({ ...confirmState, isOpen: false });
  };

  const handleCancel = () => {
    confirmState.resolve(false);
    setConfirmState({ ...confirmState, isOpen: false });
  };

  return (
  <ConfirmContext.Provider value={confirm}>
    {children}
    {confirmState.isOpen && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-sm w-full text-center border border-white/20 text-white">
          <p className="mb-4 text-lg">{confirmState.message}</p>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition duration-200 cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium transition duration-200 cursor-pointer"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
  </ConfirmContext.Provider>
);

};
