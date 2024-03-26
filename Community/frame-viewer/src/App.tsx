import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import UploadPage from "./components/UploadPage";
import ListPage from "./components/ListPage";
import ViewPage from "./components/ViewPage";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/view/:id" element={<ViewPage />} />
      </Routes>
    </>
  );
};

export default App;
