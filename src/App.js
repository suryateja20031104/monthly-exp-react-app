import { BrowserRouter, Route,Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Monthly from "./components/Monthly";
import MonthGraph from "./components/MonthGraph";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/monthly" element={<Monthly/>}/>
         <Route path="/monthly-graph" element={<MonthGraph/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
