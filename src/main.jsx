import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MathGame from './components/MathGame/MathGame.jsx';
import ImageGame from './components/ImageGame/ImageGame.jsx';
import RunningGame from './components/RunningGame.jsx';
import SumBox from './SumBox.jsx';
import FlagGames from './components/FlagGames/FlagGames.jsx';
import WordScramble from './components/Word Scramble/WordScramble.jsx';
import ScienceFlashcard from './components/ScienceFlashcard/ScienceFlashcard.jsx';
import VocabularyVolcano from './components/VocabularyVolcano/VocabularyVolcano.jsx';
import ElementMatcher from './components/ElementMatcher/ElementMatcher.jsx';
import GrammarNinja from './components/GrammarNinja/GrammarNinja.jsx';
import FractionFactory from './components/FractionFactory/FractionFactory.jsx';
import PatternPredictor from './components/PatternPredictor/PatternPredictor.jsx';
import ChemistryLab from './components/ChemistryLab/ChemistryLab.jsx';
import SpellingBee from './components/SpellingBee/SpellingBee.jsx';

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
  {
    path: "/vocabularyVolcano",
    element: <VocabularyVolcano></VocabularyVolcano>
  },
  {
    path: "/elementMatcher",
    element: <ElementMatcher></ElementMatcher>
  },
  {
    path: "/grammarNinja",
    element: <GrammarNinja></GrammarNinja>
  },
  {
    path: "/fractionFactory",
    element: <FractionFactory></FractionFactory>
  },
  {
    path: "/patternPredictor",
    element: <PatternPredictor></PatternPredictor>
  },
  {
    path: "/chemistryLab",
    element: <ChemistryLab></ChemistryLab>
  },
  {
    path: "/spellingBee",
    element: <SpellingBee></SpellingBee>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
