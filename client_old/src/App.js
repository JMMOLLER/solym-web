import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalConfigProvider } from "./GlobalConfigContext";
import SolymHeader from "./Components/header/header";
import Home from "./Components/Home/Home";
import Test from "./Components/Test/Test";
import Start from "./Components/Start/Start";
import Select from "./Components/Select/Select.jsx";
import NotFound from "./Components/NotFound/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <GlobalConfigProvider>
        <SolymHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/select" element={<Select />} />
          <Route path="/start" element={<Start />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalConfigProvider>
    </BrowserRouter>
  );
}

export default App;
