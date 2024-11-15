import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Detailtarot from "./components/detailtarot";
import Cards from "./components/cards";
import Chat from "./components/chat";
import Profile from "./components/profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/card" element={<Cards />} />
          <Route path="/card/detail/:name_short" element={<Detailtarot />} />
          <Route path="/profile" element={<Profile />} />
          {/* Bạn có thể thêm các route khác ở đây */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
