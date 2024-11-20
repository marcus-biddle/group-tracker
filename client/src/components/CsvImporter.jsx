import React, { useState } from "react";
import Papa from "papaparse";

const CsvImporter = ({ onImport, csvData, setCsvData, fileInputRef }) => {
  const [error, setError] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.type;

      if (fileType === "text/csv" || fileType === "application/vnd.ms-excel") {
        Papa.parse(file, {
          header: true, // Parse CSV headers as keys
          skipEmptyLines: true, // Skip empty rows
          complete: (result) => {
            setCsvData(result.data);
            setError(""); // Clear previous errors
            onImport(result.data); // Pass parsed data to parent
          },
          error: (err) => {
            console.error("Error parsing CSV: ", err);
            setError("Error parsing the CSV file. Please try again.");
          },
        });
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md text-black">
      <h2 className="text-lg font-bold mb-4">Import CSV File</h2>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* {csvData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Preview</h3>
          <pre className="bg-gray-200 p-2 rounded-md mt-2 overflow-x-auto">
            {JSON.stringify(csvData.slice(0, 5), null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
};

export default CsvImporter;
