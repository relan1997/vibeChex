import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Questions = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Use REACT_APP_ prefix for Create React App
        const backendUrl = "http://localhost:1997";
        if (!backendUrl) {
          throw new Error('Backend URL is not configured');
        }

        const res = await fetch(`${backendUrl}/api/${id}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to generate questions: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        // Validate response structure
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid response format: Expected an array of questions');
        }

        setQuestions(data.questions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available</p>
      ) : (
        questions.map((q, index) => (
          <div key={index}>
            <p>
              {index + 1}. {q.questionText}
            </p>
            {q.options && Array.isArray(q.options) ? (
              q.options.map((opt, i) => (
                <div key={i}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={opt}
                    />
                    {opt}
                  </label>
                </div>
              ))
            ) : (
              <p>No options available</p>
            )}
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Questions;