import React, { useState, useEffect } from "react";
import axios from "axios";
import io from 'socket.io-client'; // Import socket.io-client

function Upload() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(""); // Store AI response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish Socket.IO connection when the component mounts
    const newSocket = io("http://localhost:4000"); // Replace with your backend URL if different
    setSocket(newSocket);

    // Listen for 'ai_analysis_result' events from the server
    newSocket.on('ai_analysis_result', (data) => {
      console.log('Received AI analysis result:', data);
      setAnalysis(data.aiResponse);
      setLoading(false); // Clear loading status when analysis is received
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.off('ai_analysis_result'); // Remove the listener
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once on mount


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      setAnalysis(""); //clear the previous repsonse
      return;
    }

    setError("");
    setAnalysis(""); //clear the previous repsonse
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please upload a valid medical report.");
      return;
    }

    setLoading(true);
    setAnalysis(""); // Clear the previous analysis
    setError("");


    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload the file
      await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // No Step 2: AI analysis will come through Socket.IO

    } catch (e) {
      console.error("Error:", e);
      setError(`File upload failed: ${e.response?.data?.error || 'Unknown error'}`);
      setLoading(false); // Clear loading on error

    }
  };

  return (
    <div id="uploads" className="w-full h-screen flex justify-center items-center flex-col gap-6">
      <div id="box" className="bg-[#E3F2FD] w-[500px] h-[400px] flex flex-col items-center border-2 border-black rounded-2xl p-6 gap-6">
        <h1 className="text-xl font-bold text-black">Upload a Medical Report</h1>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="border-2 border-black w-[300px] h-[200px] p-2 cursor-pointer"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      <button
        onClick={uploadFile}
        className="w-[500px] bg-[#eb5c0d] h-[50px] rounded-lg text-white text-lg hover:bg-[#d14e09] transition"
        disabled={loading}
      >
        {loading ? "Generating Report..." : "Generate Report"}
      </button>

      {analysis && (
        <div className="mt-5 p-4 bg-gray-200 rounded-lg w-[500px] shadow-lg">
          <h2 className="font-bold text-lg">AI Analysis:</h2>
          <p className="text-sm">{analysis}</p>
        </div>
      )}
    </div>
  );
}

export default Upload;