import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LiveLessons from './components/LiveLessons';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Assessment from './components/Assessment';
import TestConnection from './components/TestConnection';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LiveLessons />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/test" element={<TestConnection />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
