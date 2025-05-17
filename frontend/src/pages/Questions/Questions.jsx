import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// --- Animations and Styles (reuse your theme) ---
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;
const [slideDirection, setSlideDirection] = useState("right"); // or "left"
const [isSliding, setIsSliding] = useState(false);


const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 0 5vw;
  background: linear-gradient(120deg, #111213 0%, #18191a 80%, #232526 100%);
  background-size: 200% 200%;
  animation: ${gradient} 60s linear infinite;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const Card = styled.div`
  background: rgba(24, 25, 26, 0.93);
  border-radius: 28px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 700px;
  width: 100%;
  margin-top: 4rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  @media (max-width: 600px) {
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    margin-top: 2.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-bottom: 1.5rem;
  color: #e0e0e0;
  text-align: center;
  text-shadow: 0 2px 12px #000a, 0 1px 0 #232526;
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;



const QuestionNumber = styled.div`
  font-size: 1.1rem;
  color: #bfc1c2;
  font-weight: 600;
  letter-spacing: 0.07em;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const QuestionText = styled.p`
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 1.2rem;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 1.15rem;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  background: rgba(35,37,38,0.6);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  color: #e0e0e0;
  transition: background 0.2s;
  &:hover {
    background: rgba(191,193,194,0.13);
  }
`;

const Radio = styled.input`
  margin-right: 0.7rem;
  accent-color: #bfc1c2;
`;

const CustomInput = styled.input`
  margin-left: 0.7rem;
  width: 60%;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: none;
  background: #232526;
  color: #e0e0e0;
  font-size: 1rem;
  outline: none;
  margin-top: 0.3rem;
  &::placeholder {
    color: #8a8d91;
    opacity: 1;
  }
`;

// --- Carousel Button Styles (matches StartButton) ---
const CarouselButton = styled.button`
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  color: #e0e0e0;
  font-weight: bold;
  padding: 0.8rem 2.2rem;
  border: none;
  border-radius: 999px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 24px 0 #23252680;
  transition: box-shadow 0.2s, background 0.3s, color 0.3s, transform 0.2s;
  outline: none;
  z-index: 2;
  margin: 0 1rem;
  &:hover {
    background: linear-gradient(90deg, #18191a 0%, #232526 100%);
    color: #bfc1c2;
    box-shadow: 0 0 36px 6px #bfc1c240;
    transform: translateY(-2px) scale(1.04);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(CarouselButton)`
  margin: 2rem auto 0 auto;
  display: block;
  width: 100%;
`;

const SlideWrapper = styled.div`
  width: 100%;
  min-height: 220px;
  position: relative;
  overflow: hidden;
`;

const SlideInner = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  transition: transform 0.45s cubic-bezier(.77,0,.18,1), opacity 0.45s;
  will-change: transform, opacity;
  transform: translateX(
    ${({ isSliding, direction }) =>
      isSliding
        ? direction === "right"
          ? "-100%"
          : "100%"
        : "0"}
  );
  opacity: ${({ isSliding }) => (isSliding ? 0 : 1)};
`;


// --- Main Component ---
const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [customAnswers, setCustomAnswers] = useState({});
  const [current, setCurrent] = useState(0);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
  (e) => {
    if (e.key === "ArrowRight" && current < questions.length - 1) {
      handleNext();
    }
    if (e.key === "ArrowLeft" && current > 0) {
      handlePrev();
    }
  },
  [current, questions.length]
);


  const handlePrev = () => {
  if (current === 0) return;
  setSlideDirection("left");
  setIsSliding(true);
  setTimeout(() => {
    setCurrent((c) => c - 1);
    setIsSliding(false);
  }, 450);
};

const handleNext = () => {
  if (current === questions.length - 1) return;
  setSlideDirection("right");
  setIsSliding(true);
  setTimeout(() => {
    setCurrent((c) => c + 1);
    setIsSliding(false);
  }, 450);
};

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
      alert("Something went wrong while submitting your answers.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <Container>
        <Card>
          <Title>Loading...</Title>
        </Card>
      </Container>
    );
  if (error)
    return (
      <Container>
        <Card>
          <Title>Error</Title>
          <p>{error}</p>
        </Card>
      </Container>
    );

  const q = questions[current];
  const isCustomFilled = customAnswers[current]?.trim().length > 0;
  const isRadioSelected = !!answers[current];

  return (
  <Container>
    <Card>
      <SlideWrapper>
        <SlideInner isSliding={isSliding} direction={slideDirection} key={current}>
          <QuestionNumber>
            Question {current + 1} of {questions.length}
          </QuestionNumber>
          <QuestionText>
            {q.questionText}
          </QuestionText>

          <OptionsGrid>
            {q.options?.map((opt, i) => (
              <OptionLabel key={i}>
                <Radio
                  type="radio"
                  name={`question-${current}`}
                  value={opt}
                  checked={answers[current] === opt}
                  onChange={() => handleRadioChange(current, opt)}
                  disabled={isCustomFilled}
                />
                {opt}
              </OptionLabel>
            ))}
          </OptionsGrid>

          <div style={{ marginTop: "0.7rem", width: "100%" }}>
            <OptionLabel as="div" style={{ background: "none", padding: 0 }}>
              Other:
              <CustomInput
                type="text"
                value={customAnswers[current] || ""}
                onChange={(e) => handleCustomInput(current, e.target.value)}
                disabled={isRadioSelected}
                placeholder="Type your own answer"
              />
            </OptionLabel>
          </div>
        </SlideInner>
      </SlideWrapper>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
          gap: "1rem",
          width: "100%",
        }}
      >
        <CarouselButton
          onClick={handlePrev}
          disabled={current === 0 || isSliding}
          aria-label="Previous"
        >
          <FaArrowLeft size={22} />
        </CarouselButton>
        {current === questions.length - 1 ? (
          <SubmitButton
            onClick={handleSubmit}
            disabled={submitLoading || isSliding}
            aria-label="Submit"
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </SubmitButton>
        ) : (
          <CarouselButton
            onClick={handleNext}
            disabled={current === questions.length - 1 || isSliding}
            aria-label="Next"
          >
            <FaArrowRight size={22} />
          </CarouselButton>
        )}
      </div>
    </Card>
  </Container>
);
}
export default Questions;
