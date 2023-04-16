// App.js
import React, { useEffect } from "react";
import Home from "./Components/Home/Home";
import Test from "./Components/Test/Test";
import Start from "./Components/Start/Start";
import Select from "./Components/Select/Select.jsx";
import NotFound from "./Components/NotFound/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [globalConfigs, setGlobalConfigs] = React.useState(() => {
    const value = localStorage.getItem("globalConfigs");
    if (value) {
      return JSON.parse(value);
    }
    return { delay: 0.15, delayValue: "3" };
  });

  // Read global configs from local storage and set them to state when the app starts
  useEffect(() => {
    const value = localStorage.getItem("globalConfigs");
    if (value) {
      setGlobalConfigs(JSON.parse(value));
    }
  }, []);

  // Update local storage when global configs change
  useEffect(() => {
    localStorage.setItem("globalConfigs", JSON.stringify(globalConfigs));
  }, [globalConfigs]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home globalConfigs={globalConfigs} setGlobalConfigs={setGlobalConfigs} />} />
        <Route path="/select" element={<Select globalConfigs={globalConfigs} setGlobalConfigs={setGlobalConfigs} />} />
        <Route path="/start" element={<Start globalConfigs={globalConfigs} setGlobalConfigs={setGlobalConfigs} />} />
        <Route path="/test" element={<Test globalConfigs={globalConfigs} />} />
        <Route path="*" element={<NotFound globalConfigs={globalConfigs} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
