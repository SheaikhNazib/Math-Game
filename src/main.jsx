import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MathGame from './components/MathGame.jsx';
import ImageGame from './components/ImageGame.jsx';
import RunningGame from './components/RunningGame.jsx';
import SumBox from './SumBox.jsx';
import FlagGames from './components/FlagGames.jsx';
import WordScramble from './components/Word Scramble/WordScramble.jsx';
import ScienceFlashcard from './components/ScienceFlashcard/ScienceFlashcard.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "/imageGame",
    element: <ImageGame></ImageGame>
  },
  {
    path: "/mathGame",
    element: <MathGame></MathGame>
  },
  {
    path: "/sumBox",
    element: <SumBox></SumBox>
  },
  {
    path: "/flagGames",
    element: <FlagGames></FlagGames>
  },
  {
    path: "/wordScramble",
    element: <WordScramble></WordScramble>
  },
  {
    path: "/scienceFlashcard",
    element: <ScienceFlashcard></ScienceFlashcard>
  },
  // {
  //   path: "/runningGame",
  //   element: <RunningGame></RunningGame>
  // }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
