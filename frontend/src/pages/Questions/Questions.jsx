import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// --- Animations and Styles ---
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideOut = keyframes`
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 2rem calc(5% + 1vw);
  background: linear-gradient(120deg, #111213 0%, #18191a 80%, #232526 100%);
  background-size: 200% 200%;
  animation: ${gradient} 60s linear infinite;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  position: relative;
  
  @media (max-width: 1366px) {
    padding: 2rem calc(3% + 0.5vw);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem calc(2% + 0.5vw);
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(220, 53, 69, 0.95);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease forwards, ${slideOut} 0.3s ease forwards 3s;
  max-width: 350px;
  display: flex;
  align-items: center;
  
  & svg {
    margin-right: 8px;
    flex-shrink: 0;
  }
`;

// Modified Card component to use flexbox for auto-scaling height and wider layout
const Card = styled.div`
  background: rgba(24, 25, 26, 0.93);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.13);
  padding: 2.5rem;
  width: 100%;
  max-width: calc(1200px + 5vw);
  margin: 1.5rem auto;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: all 0.3s ease;
  
  @media (max-width: 1366px) {
    max-width: calc(1000px + 5vw);
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 1rem auto;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
  color: #e0e0e0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
`;

const QuestionNumber = styled.div`
  font-size: 1rem;
  color: #bfc1c2;
  font-weight: 400;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  text-align: center;
`;

const QuestionText = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1.2rem;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
  
  @media (min-width: 1366px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 992px) and (max-width: 1365px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  background: rgba(35, 37, 38, 0.6);
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
  color: #e0e0e0;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(191, 193, 194, 0.13);
  }
`;

const Radio = styled.input`
  margin-right: 0.8rem;
  accent-color: #bfc1c2;
  width: 16px;
  height: 16px;
`;

const CustomInputContainer = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(35, 37, 38, 0.6);
  border-radius: 10px;
  margin-bottom: 1rem;
  
  @media (min-width: 992px) {
    display: flex;
    align-items: center;
  }
`;

const CustomInput = styled.input`
  margin-left: 0.7rem;
  width: calc(100% - 4rem);
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(191, 193, 194, 0.2);
  background: #232526;
  color: #e0e0e0;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s ease;
  
  @media (min-width: 992px) {
    width: calc(100% - 6rem);
    flex: 1;
  }
  
  &::placeholder {
    color: #8a8d91;
    opacity: 1;
  }
  
  &:focus {
    border: 1px solid rgba(191, 193, 194, 0.4);
  }
`;

const CarouselButton = styled.button`
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  color: #e0e0e0;
  font-weight: 500;
  padding: 0.75rem 1.8rem;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 16px 0 #23252680;
  transition: all 0.2s ease;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: linear-gradient(90deg, #18191a 0%, #232526 100%);
    color: #bfc1c2;
    box-shadow: 0 0 24px 4px #bfc1c230;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const SubmitButton = styled(CarouselButton)`
  margin: 1.5rem auto 0 auto;
  display: block;
  min-width: 200px;
  padding: 0.8rem 2rem;
`;

const NavigationControls = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1.5rem;
  max-width: 90%;
  
  @media (min-width: 1366px) {
    max-width: 70%;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    max-width: 100%;
  }
`;

// Modified slide wrapper to use flexbox and remove fixed heights
const SlideWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
`;

// Modified slide inner component to use flexbox and auto height
const SlideInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.45s cubic-bezier(.77, 0, .18, 1), opacity 0.45s;
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: #e88;
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
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  };

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
    if (current === 0 || isSliding) return;
    setSlideDirection("left");
    setIsSliding(true);
    setTimeout(() => {
      setCurrent((c) => c - 1);
      setIsSliding(false);
    }, 450);
  };

  const handleNext = () => {
    if (current === questions.length - 1 || isSliding) return;
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
    if (value.trim()) {
      setAnswers((prev) => ({ ...prev, [questionIndex]: "" }));
    }
  };

  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter((_, i) => 
      !answers[i] && !customAnswers[i]?.trim()
    );
    
    if (unansweredQuestions.length > 0) {
      showToast(`Please answer ${unansweredQuestions.length > 1 ? 'all questions' : 'question ' + (questions.indexOf(unansweredQuestions[0]) + 1)}`);
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
      showToast("Something went wrong while submitting your answers.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <Container>
        <Card>
          <LoadingContainer>
            <Title>Loading questions...</Title>
          </LoadingContainer>
        </Card>
      </Container>
    );
    
  if (error)
    return (
      <Container>
        <Card>
          <Title>Error</Title>
          <ErrorContainer>{error}</ErrorContainer>
        </Card>
      </Container>
    );

  const q = questions[current];
  const isCustomFilled = customAnswers[current]?.trim().length > 0;
  const isRadioSelected = !!answers[current];

  return (
    <Container>
      {toast.show && (
        <Toast>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {toast.message}
        </Toast>
      )}
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

            <CustomInputContainer>
              <OptionLabel as="div" style={{ display: "flex", alignItems: "center", background: "none", padding: 0, flexShrink: 0 }}>
                <span style={{ minWidth: "50px" }}>Other:</span>
                <CustomInput
                  type="text"
                  value={customAnswers[current] || ""}
                  onChange={(e) => handleCustomInput(current, e.target.value)}
                  disabled={isRadioSelected}
                  placeholder="Type your own answer"
                />
              </OptionLabel>
            </CustomInputContainer>
          </SlideInner>
        </SlideWrapper>

        <NavigationControls>
          <CarouselButton
            onClick={handlePrev}
            disabled={current === 0 || isSliding}
            aria-label="Previous"
          >
            <FaArrowLeft size={18} style={{ marginRight: "8px" }} /> Previous
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
              style={{ marginLeft: "auto" }}
            >
              Next <FaArrowRight size={18} style={{ marginLeft: "8px" }} />
            </CarouselButton>
          )}
        </NavigationControls>
      </Card>
    </Container>
  );
};

export default Questions;