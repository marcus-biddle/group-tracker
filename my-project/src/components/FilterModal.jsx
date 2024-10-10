import React from 'react'

export const FilterModal = ({ showModal, setShowModal }) => {
    if (!showModal) return null; // Return null if modal is not shown
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">This is a Popup Modal</h2>
          <p className="mb-4">You can add your content here. Customize it however you like!</p>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
