import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [customAnswers, setCustomAnswers] = useState({});
  const [favAnimal, setFavAnimal] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const backendUrl = "http://localhost:1997";
        const res = await fetch(`${backendUrl}/api/${id}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok)
          throw new Error(
            `Failed to generate questions: ${res.status} ${res.statusText}`
          );

        const data = await res.json();
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error(
            "Invalid response format: Expected an array of questions"
          );
        }

        setQuestions(data.questions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleRadioChange = (questionIndex, value) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
    setCustomAnswers((prev) => ({ ...prev, [questionIndex]: "" })); // Clear other input
  };

  const handleCustomInput = (questionIndex, value) => {
    setCustomAnswers((prev) => ({ ...prev, [questionIndex]: value }));
    setAnswers((prev) => ({ ...prev, [questionIndex]: "" })); // Clear radio selection
  };

  const handleSubmit = async () => {
    const allAnswered = questions.every(
      (_, i) => answers[i] || customAnswers[i]
    );
    if (!allAnswered || !favAnimal.trim()) {
      alert("Please answer all questions and enter your favourite animal.");
      return;
    }

    const formatted = questions.map((q, i) => ({
      questionText: q.questionText,
      selectedOption: answers[i] || customAnswers[i],
    }));

    formatted.push({
      questionText: "What's your favourite animal?",
      selectedOption: favAnimal.trim(),
    });

    try {
      setSubmitLoading(true); // start loading

      const res = await fetch(`http://localhost:1997/api/${id}/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formatted }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // Only navigate after success
      navigate(`/${id}/results`);
    } catch (err) {
      console.error("Error submitting answers:", err);
      alert("Something went wrong while submitting your answers.");
    } finally {
      setSubmitLoading(false); // stop loading no matter what
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available</p>
      ) : (
        <>
          {questions.map((q, index) => {
            const isCustomFilled = customAnswers[index]?.trim().length > 0;
            const isRadioSelected = !!answers[index];

            return (
              <div key={index}>
                <p>
                  {index + 1}. {q.questionText}
                </p>

                {q.options?.map((opt, i) => (
                  <div key={i}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={opt}
                        checked={answers[index] === opt}
                        onChange={() => handleRadioChange(index, opt)}
                        disabled={isCustomFilled}
                      />
                      {opt}
                    </label>
                  </div>
                ))}

                <div>
                  <label>
                    Other:
                    <input
                      type="text"
                      value={customAnswers[index] || ""}
                      onChange={(e) => handleCustomInput(index, e.target.value)}
                      disabled={isRadioSelected}
                    />
                  </label>
                </div>

                <hr />
              </div>
            );
          })}

          <div>
            <p>{questions.length + 1}. What's your favourite animal?</p>
            <input
              type="text"
              value={favAnimal}
              onChange={(e) => setFavAnimal(e.target.value)}
              placeholder="Type your answer here"
            />
            <hr />
          </div>

          <button onClick={handleSubmit} disabled={submitLoading}>
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </>
      )}
    </div>
  );
};

export default Questions;
