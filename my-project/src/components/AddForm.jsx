import React, { useState } from 'react';

export const AddForm = () => {
  // State variables
  const [dropdownValue, setDropdownValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [isToday, setIsToday] = useState(true); // True for today, false for selecting a date
  const [selectedDate, setSelectedDate] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Log form data to the console (you can replace this with API calls or any other action)
    const formData = {
      dropdown: dropdownValue,
      number: numberValue,
      date: isToday ? new Date().toISOString().split('T')[0] : selectedDate,
    };
    console.log(formData);

    // Reset form (optional)
    setDropdownValue('');
    setNumberValue('');
    setIsToday(true);
    setSelectedDate('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md">
      {/* <h2 className="text-2xl font-bold mb-6">User Form</h2> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropdown */}
        <div>
          <label className="block text-lg mb-2">Select an Exercise:</label>
          <select
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
            className="w-full p-2 border rounded-md bg-white border-slate-600"
          >
            <option value="" disabled>Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        {/* Number Input */}
        <div>
          <label className="block text-lg mb-2">Enter a Number:</label>
          <input
            type="number"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            className="w-full p-2 border rounded-md bg-white border-slate-600"
            placeholder="Enter a number"
          />
        </div>

        {/* Date Picker: Today or Select Date */}
        <div>
          <label className="block text-lg mb-2">Is this for today or another date?</label>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="today"
              name="dateChoice"
              checked={isToday}
              onChange={() => setIsToday(true)}
              className="mr-2"
            />
            <label htmlFor="today" className="mr-4">Today</label>

            <input
              type="radio"
              id="previousDate"
              name="dateChoice"
              checked={!isToday}
              onChange={() => setIsToday(false)}
              className="mr-2"
            />
            <label htmlFor="previousDate">Previous Date</label>
          </div>

          {!isToday && (
            <div>
              <label className="block text-lg mb-2">Pick a Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-md bg-white border-slate-500"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
