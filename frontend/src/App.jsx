import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react';

import Home from './components/Home.jsx';
import Room from './components/Room.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  )

  // return (
  //   <Router>
  //     <Routes>
  //       <Route path =
  //     </Routes>
  //   </Router>
  // )
}

export default App
