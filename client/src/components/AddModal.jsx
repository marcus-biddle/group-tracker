import React from 'react'
import { AddForm } from './AddForm';
import { isAuthenticated } from '../helpers/authHelper';

export const AddModal = ({ showModal, setShowModal }) => {
    if (!showModal) return null; // Return null if modal is not shown
    if (!isAuthenticated()) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">What Did You Do Today?</h2>
          <p className="mb-4">Update your count below.</p>
          <div>
            <AddForm setShowModal={setShowModal} />
          </div>
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
