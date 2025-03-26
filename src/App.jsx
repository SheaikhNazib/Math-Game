import './App.css'
import Navbar from './components/Navbar'
import MathGame from './components/MathGame/MathGame.jsx'
import ImageGame from './components/ImageGame/ImageGame.jsx'
import React from 'react';
import FractionFactory from './components/FractionFactory/FractionFactory';

function App() {


  return (
    <>
      <Navbar></Navbar>
      <ImageGame></ImageGame>
      <FractionFactory />
    </>
  )
}

export default App
