import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TokenProvider } from "./context/TokenContext"; 
import { AuthProvider } from "./context/AuthContext"; 
import FacebookLogin from "./components/FacebookLogin";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  return (
    <Router> 
      <TokenProvider>
        <AuthProvider> 
          <Navbar/>
          <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/" element={<FacebookLogin />} />
          </Routes>
        </AuthProvider>
      </TokenProvider>
    </Router>
  );
}

export default App;
