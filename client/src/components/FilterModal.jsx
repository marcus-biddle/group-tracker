import React, { useState } from 'react'
import { months } from '../sections/Activity/Activity';
import Header from './Header';
import Text from './Text';

const currentYear = new Date().getFullYear();

export const FilterModal = ({ showModal, setShowModal, onSave }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(currentYear);  

    if (!showModal) return null; // Return null if modal is not shown
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
        <div className="bg-secondaryMenu p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <Header level='h3' color='primaryText'>What did you do today?</Header>
          <Text size='small' color='mutedText'>Update your count below.</Text>

          {/* Month Selection Dropdown */}
          <div className=" text-secondaryText py-4">
            <label className="block text-sm font-medium">Month</label>
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
          <div className="text-secondaryText pb-4">
            <label className="block text-sm font-medium">Year</label>
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
              className="bg-errorBg text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(selectedMonth, selectedYear)}
              className=" bg-primary text-white px-4 py-2 rounded-md"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    );
  };
