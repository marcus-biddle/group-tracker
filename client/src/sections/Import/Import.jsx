import React, { useRef, useState } from 'react'
import CsvImporter from '../../components/CsvImporter';
import { getUserId } from '../../helpers/authHelper';
import { motion } from 'framer-motion';
import { FaRedoAlt } from "react-icons/fa";
import { addExercise } from '../../api/exerciseApi';
import { useNavigate } from 'react-router';

const exerciseOptions = [
    { id: 1, name: "pushups" },
    { id: 2, name: "pullups" },
    { id: 3, name: "running" }
  ];

const items = [
    {
        title: "",
        steps: `
        2.  \n
        3. Format your data in the following structure: \n
        Columns: \n
        Date (e.g., 2024-11-15) \n
        Count (numeric values only) \n
        Save the file as a .csv (Comma-Separated Values) file. \n
        Helpful tip: Copy paste the Date column and the column with your name if you're importing from Cal's Spreadsheet.`
    }
]

export const Import = () => {
    const [csvData, setCsvData] = useState([]);
    const [importedData, setImportedData] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(true);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

  const handleReset = () => {
    setCsvData([])
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    setSelectedExercise("")
    }

  const handleImport = async (data) => {
    const filteredData = data.filter(item => item.Count !== '');

    const formattedData = filteredData.map(row => ({
        user_id: getUserId(), // Replace with a function to get the current user's ID
        exercise_id: selectedExercise, // Replace with logic to map exercise type to its ID
        exercise_count: parseInt(row.Count, 10), // Convert Count to a number
        date: new Date(row.Date).toISOString().split('T')[0], // Format Date as YYYY-MM-DD
      }));

    setImportedData(formattedData);

    try {
        await Promise.all(
          formattedData.map(async (entry) => {
            try {
              const response = await addExercise(entry);
              console.log("Successfully added:", response);
              return response;
            } catch (error) {
              console.error("Failed to add entry:", entry, error);
              return null;
            }
          })
        );
        alert("Import completed.");
        handleReset();
        navigate('/activity')
      } catch (error) {
        console.error("Error during import:", error);
      }

    console.log("Imported Data: ", formattedData);
    // You can further process or save this data to your backend
  };
  
    return (
        <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Import</h1>
      <div className="w-full max-w-lg mx-auto">
            <div className="mb-4 border-gray-700">
            {/* Accordion Header */}
            <button
                onClick={() => setExpandedIndex(!expandedIndex)}
                className="w-full flex justify-between items-center p-4 bg-[#291B34] text-[#EFEDFD] rounded-md shadow-md"
            >
                <span className="text-lg font-semibold">How to import data from a CVS file?</span>
                <motion.div
                animate={{
                    rotate: !expandedIndex ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="ml-2"
                >
                ▼
                </motion.div>
            </button>

            {/* Accordion Content */}
            <motion.div
                initial="collapsed"
                animate={!expandedIndex ? "expanded" : "collapsed"}
                variants={{
                collapsed: { height: 0, opacity: 0 },
                expanded: { height: "auto", opacity: 1 },
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-md bg-[#291B34] bg-opacity-50"
            >
                <div className="p-4 text-[#7C7986]">
                <p>1. Open a spreadsheet application like Excel, Google Sheets, or another CSV editor.</p> <br />
                <p>2. Format your data in the following structure: <br/>
                    Columns: <br/>
                    <span className='pl-8'>Date</span> (e.g., 2024-11-15) <br/>
                    <span className='pl-8'>Count</span> (numeric values only) <br/> <br />
                    Helpful tip: Copy paste the Date column and the column with your name if you're importing from Cal's Spreadsheet.
                </p> <br />
                <p>3. Save the file as a .csv (Comma-Separated Values) file.</p> <br />
                <p>4. Exercise Dropdown: Ensure the exercise column is correctly selected before importing your csv file.</p> 
                </div>
            </motion.div>
            </div>
        </div>
      <label className="block mb-2">
        Select Exercise:
        <select
          value={selectedExercise}
          disabled={importedData.length > 0}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="block capitalize text-black w-full mt-1 p-2 border rounded-md bg-white shadow-lg max-w-[90vw] overflow-hidden"
        >
          <option value={""}>-- Select an Exercise --</option>
          {exerciseOptions.map((option) => (
            <option key={option.id} value={option.id} className='text-black capitalize'>
              {option.name}
            </option>
          ))}
        </select>
      </label>

      <CsvImporter onImport={handleImport} csvData={csvData} setCsvData={setCsvData} fileInputRef={fileInputRef} />
      {/* {importedData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Imported Logs</h2>
          <ul className="mt-2 text-white">
            {importedData.map((row, index) => (
              <li key={index} className="p-2 border-b">
                {JSON.stringify(row)}
              </li>
            ))}
          </ul>
        </div>
      )} */}
      <div className='flex gap-4 my-6'>
        <button 
        className='bg-transparent text-[#00B2CC] border border-[#00B2CC] shadow-lg'
        onClick={() => handleReset()}
        >
            <FaRedoAlt />
        </button>
        <button disabled={!(selectedExercise && csvData.length > 0)} className='w-full bg-green-300 text-black font-bold shadow-lg disabled:bg-slate-600 disabled:text-slate-400'>
            Import CSV File
        </button>
      </div>
    </div>
    );
}
