// import './App.css';
import './assets/css/base.css'
import './assets/css/main.css'
import './assets/font/fontawesome-free-6.1.1-web/css/all.min.css'
import './assets/css/font.css'
import Navbar from './components/NavBar'
import Guide from './pages/guide'
import Contact from './pages/contact'
import Home from './pages/home';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';

import React from "react";



function App() {


  return (  
      
    <div className="app" > 
        <Router>
            <Navbar />
            <Routes>
                <Route exact path='/' element={<Home/>} />
                <Route path='/contact' element={<Contact/>} />
                <Route path='/guide' element={<Guide/>} />
            </Routes>            
        </Router>
        <footer className="footer">
        </footer>
    </div>
  );
  
}




export default App;
