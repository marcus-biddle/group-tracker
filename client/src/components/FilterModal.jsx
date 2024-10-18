import React, { useState } from 'react'
import { months } from '../sections/Activity/Activity';

const currentYear = new Date().getFullYear();

export const FilterModal = ({ showModal, setShowModal, onSave }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(currentYear);  

    if (!showModal) return null; // Return null if modal is not shown
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-80">
          <h2 className="text-xl mb-4">Select Month and Year</h2>

          {/* Month Selection Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="block bg-white w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="2023"
              max={currentYear}
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selectedMonth, selectedYear)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    );
  };
