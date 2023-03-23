import { Route, Routes } from "react-router-dom";
import LoginPage from "./Login";
import LabelInputPage from './Label';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/labels' element={<LabelInputPage />} />
      </Routes>
    </div>
  );
}

export default App;
