import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const UserSelectModal = ({ isOpen, onClose, users, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#23192C] rounded-lg w-full max-w-md mx-4 shadow-lg"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-[#A49EAF]">Select User</h2>
          <button onClick={onClose} className="text-[#00B2CC] border border-[#00B2CC] bg-transparent">
            <FaTimes />
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search for a user..."
            className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredUsers.length > 0 && searchTerm !== '' ? (
              filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 bg-[#201726] text-[#918E9D] rounded-md transition"
                >
                  <span className="">{user.fullname}</span>
                  {/* <span className="text-sm text-gray-500">ID: {user.id}</span> */}
                </button>
              ))
            ) : (
              <p className="text-[#918E9D] font-semibold text-center">No users found</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSelectModal;
