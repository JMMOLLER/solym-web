import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Select from "./Components/Select/Select.jsx";
import Start from "./Components/Start/Start";
import Test from "./Components/Test/Test";
import NotFound from "./Components/NotFound/NotFound";

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/select" element={<Select />} />
                <Route path="/start" element={<Start />} />
                <Route path="/test" element={<Test />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
