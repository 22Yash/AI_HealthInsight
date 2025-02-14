import React, { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [file, setFile] = useState();
  const [analysis, setAnalysis] = useState(""); // Store AI-generated insights

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please upload a report');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      setAnalysis(response.data.aiAnalysis); // Set AI-generated insights

    } catch (e) {
      console.error("Error uploading file ", e);
      alert('File Upload Failed');
    }
  };

  return (
   <>
   <div id="uploads" className='w-full h-screen flex justify-center items-center flex-col gap-[30px]'>
    <div id="box" className='bg-[#E3F2FD] w-[500px] h-[400px] flex flex-col items-center border-2 border-black rounded-[20px] p-[20px] gap-[30px]'>
      <h1 className='text-[20px] font-bold text-black'>Upload a file</h1>
      <input type="file" onChange={handleFileChange} className='border-2 border-black w-[300px] h-[200px]'/>
    </div>  
    <button 
      onClick={uploadFile}
      className='w-[500px] bg-[#eb5c0d] h-[50px] rounded-[6px] text-white text-[20px]'>
      Generate a Report
    </button>

    {analysis && (
      <div className="mt-5 p-4 bg-gray-200 rounded-lg w-[500px]">
        <h2 className="font-bold text-lg">AI Analysis:</h2>
        <p className="text-sm">{analysis}</p>
      </div>
    )}
   </div>
   </>
  )
}

export default Upload;
