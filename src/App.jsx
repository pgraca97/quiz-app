import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Header from './components/Header';
import UserForm from './components/UserForm';
import Question from './components/Question';
import Results from './components/Results';
import { UserProvider } from './components/UserContext';
import './App.css';

const App = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState('');
  const [artwork, setArtwork] = useState(null);

  // Quiz questions data
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
    {
      question: "What's your ideal vacation?",
      options: ["Beach resort 🏖️", "Mountain cabin 🏔️", "City exploration 🏙️", "Desert adventure 🏜️"],
    },
    {
      question: "Pick your favorite season:",
      options: ["Summer ☀️", "Winter ❄️", "Spring 🌸", "Autumn 🍂"],
    },
    {
      question: "Choose your preferred time of day:",
      options: ["Dawn 🌅", "Noon ☀️", "Dusk 🌆", "Midnight 🌙"],
    },
    {
      question: "What's your spirit animal?",
      options: ["Dragon 🐉", "Dolphin 🐬", "Wolf 🐺", "Eagle 🦅"],
    }
  ];

  // Keywords for Met Museum search
  const keywords = {
    Fire: "fire sun flame red",
    Water: "water ocean sea blue",
    Earth: "earth mountain forest green",
    Air: "air sky wind cloud",
  };

  // Map answers to elements
  const elements = {
    "Red 🔴": "Fire",
    "Beach resort 🏖️": "Water",
    "Mountain cabin 🏔️": "Earth",
    "City exploration 🏙️": "Air",
    "Desert adventure 🏜️": "Fire",
    "Summer ☀️": "Fire",
    "Winter ❄️": "Water",
    "Spring 🌸": "Earth",
    "Autumn 🍂": "Air",
    "Dawn 🌅": "Air",
    "Noon ☀️": "Fire",
    "Dusk 🌆": "Earth",
    "Midnight 🌙": "Water",
    "Dragon 🐉": "Fire",
    "Dolphin 🐬": "Water",
    "Wolf 🐺": "Earth",
    "Eagle 🦅": "Air",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
  };

  // Handle answer selection
  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  // Determine the element based on answers
  const determineElement = (answers) => {
    const counts = {};
    answers.forEach((answer) => {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => {
      return counts[a] > counts[b] ? a : b;
    });
  };

  // Fetch artwork from Metropolitan Museum API
  const fetchArtwork = async (keyword) => {
    try {
      // First, search for objects with the keyword
      const searchResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(keyword)}`
      );
      
      if (!searchResponse.ok) {
        throw new Error('Search failed');
      }
      
      const searchData = await searchResponse.json();
      
      if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
        throw new Error('No artworks found');
      }
      
      // Get a random object from the search results (from first 20 results for better quality)
      const randomIndex = Math.floor(Math.random() * Math.min(20, searchData.objectIDs.length));
      const objectId = searchData.objectIDs[randomIndex];
      
      // Fetch the details of the selected object
      const objectResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
      );
      
      if (!objectResponse.ok) {
        throw new Error('Failed to fetch artwork details');
      }
      
      const objectData = await objectResponse.json();
      
      // Make sure the object has an image
      if (!objectData.primaryImage) {
        // Try another object if this one has no image
        const newIndex = (randomIndex + 1) % Math.min(20, searchData.objectIDs.length);
        const newObjectId = searchData.objectIDs[newIndex];
        
        const newObjectResponse = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${newObjectId}`
        );
        
        if (newObjectResponse.ok) {
          const newObjectData = await newObjectResponse.json();
          if (newObjectData.primaryImage) {
            setArtwork(newObjectData);
            return;
          }
        }
      }
      
      setArtwork(objectData);
      
    } catch (error) {
      console.error('Error fetching artwork from Met Museum:', error);
      // Fallback to a placeholder
      setArtwork({
        title: `${keyword} Element`,
        primaryImage: `https://via.placeholder.com/600x400?text=${keyword}+Element`,
        artistDisplayName: 'Unable to load from Met Museum',
        objectDate: '',
        medium: '',
        department: '',
        objectURL: 'https://www.metmuseum.org/'
      });
    }
  };

  // Handle quiz completion
  useEffect(() => {
    if (currentQuestionIndex === questions.length && answers.length > 0) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex]);

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setElement('');
    setArtwork(null);
  };

  return (
    <Router>
      <UserProvider>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<UserForm />} />
              <Route
                path="/quiz"
                element={
                  currentQuestionIndex < questions.length ? (
                    <Question 
                      question={questions[currentQuestionIndex].question} 
                      options={questions[currentQuestionIndex].options}
                      onAnswer={handleAnswer}
                    />
                  ) : (
                    <div>
                      <Results element={element} artwork={artwork} />
                      <button onClick={resetQuiz} className="reset-btn">
                        Take Quiz Again
                      </button>
                    </div>
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;