import { Route, Routes } from "react-router-dom";

import "./index.css";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import BusinessRecommendation from "./pages/BusinessRecommendation";
import FriendRecommendation from "./pages/FriendRecommendation";
import Feedback from "./pages/Feedback";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="analysis" element={<Analysis/>}/>
        <Route path="business-recommendation" element={<BusinessRecommendation/>} />
        <Route path="friend-recommendation" element={<FriendRecommendation/>} />
        <Route path="feedback" element={<Feedback/>} /> */}
      </Routes>
    </div>
  );
}

export default App;