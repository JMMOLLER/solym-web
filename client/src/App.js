import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Views/Home";
import Select from "./Views/Select";

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/select" element={<Select />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
