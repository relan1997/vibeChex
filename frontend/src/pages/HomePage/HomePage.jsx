import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Subtle, slow gradient
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

// Floating blurred circles for vibe
const Float = keyframes`
  0% { transform: translateY(0) scale(1);}
  50% { transform: translateY(-30px) scale(1.07);}
  100% { transform: translateY(0) scale(1);}
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 0 5vw; /* Add horizontal padding */
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


const AccentCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.18;
  pointer-events: none;
  z-index: 0;
  animation: ${Float} 8s ease-in-out infinite;

  &:nth-child(1) {
    width: 420px; height: 420px;
    background: #3a3f47;
    top: -120px; left: -140px;
    animation-delay: 0s;
  }
  &:nth-child(2) {
    width: 260px; height: 260px;
    background: #bfc1c2;
    bottom: 80px; right: -100px;
    animation-delay: 3s;
  }
  &:nth-child(3) {
    width: 180px; height: 180px;
    background: #232526;
    top: 60%; left: 10vw;
    animation-delay: 5s;
  }
`;

// const Title = styled.h1`
//   font-size: 6rem;
//   font-weight: 900;
//   letter-spacing: 0.1em;
//   margin-bottom: 0.5rem;

//   /* Darker, sleek text */
//   color: #000000;

//   /* Very subtle glow */
//   text-shadow:
//     0 1.5px 8px rgba(255,255,255,255.10),
//     0 1px 0 #18191a;

//   z-index: 1;
//   text-align: center;
//   transition: font-size 0.2s;

//   @media (max-width: 900px) {
//     font-size: 3.5rem;
//   }
//   @media (max-width: 600px) {
//     font-size: 2.2rem;
//   }
// `;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;

  /* Darker, sleek text */
  color: #000000;

  /* Very subtle glow */
  text-shadow:
    0 1.5px 8px rgba(255,255,255,255.10),
    0 1px 0 #18191a;

  z-index: 1;
  text-align: center;
  transition: font-size 0.2s;

  @media (max-width: 900px) {
    font-size: 3.5rem;
  }
  @media (max-width: 600px) {
    font-size: 2.2rem;
  }
`;




const Subheading = styled.div`
  font-size: 1.25rem;
  color: #bfc1c2;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-bottom: 2.2rem;
  text-align: center;
  z-index: 1;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #8a8d91;
  line-height: 1.5;
  max-width: 500px;
  text-align: center;
  margin-bottom: 1.5rem;
  z-index: 1;
  font-weight: 400;
  letter-spacing: 0.01em;
  @media (max-width: 600px) {
    font-size: 0.92rem;
  }
`;

const StartButton = styled.button`
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  color: #e0e0e0;
  font-weight: bold;
  padding: 1.1rem 3rem;
  border: none;
  border-radius: 999px;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 4px 24px 0 #23252680, 0 0 0 0 #bfc1c2;
  transition: box-shadow 0.2s, background 0.3s, color 0.3s, transform 0.2s;
  outline: none;
  margin-top: 0.5rem;
  z-index: 1;

  &:hover {
    background: linear-gradient(90deg, #18191a 0%, #232526 100%);
    color: #bfc1c2;
    box-shadow: 0 0 36px 6px #bfc1c240;
    transform: translateY(-2px) scale(1.04);
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const timestamp = Date.now();
    navigate(`/${timestamp}/questions`);
  };

  return (
    <Container>
      <AccentCircle />
      <AccentCircle />
      <AccentCircle />
      <Title>VIBE_CHEX</Title>
      <Subheading>
        The Ultimate Personality Vibe Check
      </Subheading>
      <Description>
        Step into the world of Vibe Chex, where your answers unlock a digital mirror for your soul. 
        We blend psychology, pop culture, and a dash of cosmic humor to reveal your inner Pokémon, 
        your elemental energy, and the kind of roast only a true friend would dare deliver. 
        Ready to see what the universe thinks of your vibe?
      </Description>
      <StartButton onClick={handleNavigate}>
        Start the Quiz
      </StartButton>
    </Container>
  );
};

export default HomePage;
