import './App.css'
import Navbar from './components/Navbar'
import React from 'react';
import ImageGame from './components/ImageGame/ImageGame';
function App() {
  return (
    <React.StrictMode>
      <Navbar />
      <ImageGame />
    </React.StrictMode>
  )
}

export default App
