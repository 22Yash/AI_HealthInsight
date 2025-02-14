import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./component/HomePage";
import Upload from "./component/Upload";

function App() {
  return (
    <BrowserRouter>
      <div id="app">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/uploads" element={<Upload />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
