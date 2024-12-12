"use client"
import { useState, useEffect } from 'react';

const TestPage = () => {
  // Static answers data: Preload answers for 3 questions, leave 2 questions without any entry
  const staticAnswers = ['A', 'B', 'B', 'A']; // Preload answers for questions 1, 2, 3, no answers for questions 4 and 5

  // Initialize the answers state from static data
  const [answers, setAnswers] = useState([]);

  // Fetch saved answers (using static data) when the component mounts
  useEffect(() => {
    setAnswers(staticAnswers); // Mimicking data being fetched from an API or other sources
  }, []);

  // Handle answer change (simulated update of static answers)
  const handleAnswerChange = (questionIndex, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answer; // Add or update the answer for the specific question
    setAnswers(updatedAnswers);
  };

  return (
    <div>
      <h1>Test Page</h1>
      <form>
        {[...Array(5)].map((_, i) => { // Render 5 questions
          const questionIndex = i; // Use the index of the array to represent the question number
          return (
            <div key={questionIndex}>
              <p>Question {i + 1}</p>
              <div>
                {['A', 'B', 'C', 'D', 'E'].map((choice) => (
                  <label key={`${questionIndex}-${choice}`}>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={choice}
                      checked={answers[questionIndex] === choice}
                      onChange={() => handleAnswerChange(questionIndex, choice)}
                    />
                    {choice}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default TestPage;

