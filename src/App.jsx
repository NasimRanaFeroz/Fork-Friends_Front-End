import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import BusinessRecommendation from "./pages/BusinessRecommendation";
import FriendRecommendation from "./pages/FriendRecommendation";
import Feedback from "./pages/Feedback";
import UserAnalysis from "./components/UserAnalysis";
import ReviewAnalysis from "./components/ReviewAnalysis";
import BusinessAnalysis from "./components/BusinessAnalysis";
import RatingAnalysis from "./components/RatingAnalysis";
import CheckInAnalysis from "./components/CheckInAnalysis";
import ComprehensiveAnalysis from "./components/ComprehensiveAnalysis";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="data-analysis" element={<Analysis />}>
          <Route index element={<BusinessAnalysis />} />
          <Route path="user-analysis" element={<UserAnalysis />} />
          <Route path="review-analysis" element={<ReviewAnalysis />} />
          <Route path="rating-analysis" element={<RatingAnalysis />} />
          <Route path="check-in-analysis" element={<CheckInAnalysis />} />
          <Route
            path="comprehensive-analysis"
            element={<ComprehensiveAnalysis />}
          />
        </Route>
        <Route
          path="business-recommendation"
          element={<BusinessRecommendation />}
        />
        <Route
          path="friend-recommendation"
          element={<FriendRecommendation />}
        />
        <Route path="feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
}

export default App;
