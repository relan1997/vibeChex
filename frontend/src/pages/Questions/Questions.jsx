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
    setCustomAnswers((prev) => ({ ...prev, [questionIndex]: "" }));
  };

  const handleCustomInput = (questionIndex, value) => {
    setCustomAnswers((prev) => ({ ...prev, [questionIndex]: value }));
    setAnswers((prev) => ({ ...prev, [questionIndex]: "" }));
  };

  const handleSubmit = async () => {
    const allAnswered = questions.every(
      (_, i) => answers[i] || customAnswers[i]
    );
    if (!allAnswered) {
      alert("Please answer all questions.");
      return;
    }

    const formatted = questions.map((q, i) => ({
      questionText: q.questionText,
      selectedOption: answers[i] || customAnswers[i],
    }));

    try {
      setSubmitLoading(true);

      const res = await fetch(`http://localhost:1997/api/${id}/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formatted }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      await res.json();
      navigate(`/${id}/results`);
    } catch (err) {
      console.error("Error submitting answers:", err);
      alert("Something went wrong while submitting your answers.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
      <h1>Questions</h1>
      {questions.length === 0 ? (
        <p>No questions available</p>
      ) : (
        <>
          {questions.map((q, index) => {
            const isCustomFilled = customAnswers[index]?.trim().length > 0;
            const isRadioSelected = !!answers[index];

            return (
              <div key={index} style={{ marginBottom: "2rem" }}>
                <p>
                  {index + 1}. {q.questionText}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  {q.options?.map((opt, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={opt}
                        checked={answers[index] === opt}
                        onChange={() => handleRadioChange(index, opt)}
                        disabled={isCustomFilled}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  <label>
                    Other:
                    <input
                      type="text"
                      value={customAnswers[index] || ""}
                      onChange={(e) =>
                        handleCustomInput(index, e.target.value)
                      }
                      disabled={isRadioSelected}
                      style={{ marginLeft: "0.5rem", width: "60%" }}
                    />
                  </label>
                </div>
                <hr />
              </div>
            );
          })}

          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </>
      )}
    </div>
  );
};

export default Questions;
