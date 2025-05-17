import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";
import styled, { keyframes } from "styled-components";

// Animations from HomePage
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const Float = keyframes`
  0% { transform: translateY(0) scale(1);}
  50% { transform: translateY(-30px) scale(1.07);}
  100% { transform: translateY(0) scale(1);}
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(120deg, #111213 0%, #18191a 80%, #232526 100%);
  background-size: 200% 200%;
  animation: ${gradient} 60s linear infinite;
  color: #e0e0e0;
  position: relative;
  overflow-x: hidden;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ContentWrapper = styled.div`
  width: 100%;
  margin: 5rem auto 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  color: #000000;
  text-shadow: 0 1.5px 8px rgba(255,255,255.10), 0 1px 0 #18191a;
  text-align: center;
  transition: font-size 0.2s;
  
  @media (max-width: 900px) {
    font-size: 2.5rem;
  }
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: #8a8d91;
  line-height: 1.5;
  width: 100%;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  padding: 0 1rem;
  
  @media (max-width: 600px) {
    font-size: 0.92rem;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const popIn = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const ResultCard = styled.div`
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: ${popIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    background: linear-gradient(90deg, #18191a 0%, #232526 100%);
  }
`;

const PokemonCard = styled(ResultCard)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "label img"
    "value img"
    "desc desc";
  column-gap: 0.75rem;
  align-items: start;
`;

const CardLabel = styled.h2`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #bfc1c2;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 600;
  grid-area: ${props => props.gridArea || "auto"};
`;

const CardValue = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: #e0e0e0;
  margin-bottom: 0.75rem;
  letter-spacing: 0.03em;
  grid-area: ${props => props.gridArea || "auto"};
`;

const CardDescription = styled.p`
  font-size: 0.85rem;
  color: #8a8d91;
  text-align: center;
  line-height: 1.4;
  grid-area: ${props => props.gridArea || "auto"};
`;

const PokemonImage = styled.img`
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  padding: 0.25rem;
  grid-area: ${props => props.gridArea || "auto"};
`;

const ProfileImage = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  border: 2px solid #bfc1c2;
  overflow: hidden;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RoastButton = styled.button`
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  color: #e0e0e0;
  font-weight: bold;
  padding: 0.8rem 2.5rem;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 24px 0 #23252680, 0 0 0 0 #bfc1c2;
  transition: box-shadow 0.2s, background 0.3s, color 0.3s, transform 0.2s;
  outline: none;
  margin-top: 2rem;
  z-index: 1;

  &:hover {
    background: linear-gradient(90deg, #18191a 0%, #232526 100%);
    color: #bfc1c2;
    box-shadow: 0 0 36px 6px #bfc1c240;
    transform: translateY(-2px) scale(1.04);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  animation: ${fadeIn} 0.3s ease;
`;

const ModalCard = styled.div`
  position: relative;
  background: linear-gradient(120deg, #111213 0%, #18191a 80%, #232526 100%);
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  max-width: 32rem;
  width: 92%;
  margin: 0 1rem;
  border: 1px solid #232526;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
  animation: ${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  text-align: center;
  color: #e0e0e0;
  margin-bottom: 1.2rem;
  letter-spacing: 0.05em;
  font-weight: 700;
`;

const ModalText = styled.p`
  color: #bfc1c2;
  font-style: italic;
  text-align: center;
  white-space: pre-line;
  font-size: 1rem;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #8a8d91;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
  
  &:hover {
    color: #e0e0e0;
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #111213 0%, #18191a 80%, #232526 100%);
  background-size: 200% 200%;
  animation: ${gradient} 60s linear infinite;
  color: #e0e0e0;
  position: relative;
`;

const LoadingCard = styled.div`
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  padding: 2rem 3rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  animation: ${popIn} 0.5s ease-out forwards;
  z-index: 1;
`;

const LoadingText = styled.h1`
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 0.05em;
  color: #bfc1c2;
`;

const Results = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoast, setShowRoast] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for customId:", id);
        const backendUrl = "http://localhost:1997";
        const res = await axios.get(`${backendUrl}/api/${id}/personality`);
        console.log("Response received:", res.data);
        setResult(res.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    if (id) fetchData();
    else console.warn("No customId in query params!");
  }, [id]);

  const toggleRoast = () => {
    setShowRoast(!showRoast);
  };

  if (loading)
    return (
      <LoadingContainer>
        <AccentCircle />
        <AccentCircle />
        <AccentCircle />
        <LoadingCard>
          <LoadingText>LOADING...</LoadingText>
        </LoadingCard>
      </LoadingContainer>
    );

  if (!result)
    return (
      <LoadingContainer>
        <AccentCircle />
        <AccentCircle />
        <AccentCircle />
        <LoadingCard>
          <LoadingText>NO RESULT FOUND</LoadingText>
        </LoadingCard>
      </LoadingContainer>
    );

  const resultSections = [
    { label: 'Core Personality Archetype', key: 'corePersonalityArchetype', descKey: 'corePersonalityArchetypeDescription' },
    { label: 'Element', key: 'element', descKey: 'elementDescription' },
    { label: 'Pokemon', key: 'pokemon', descKey: 'pokemonDescription', isPokemon: true },
    { label: 'Country', key: 'country', descKey: 'countryDescription' },
    { label: 'Aesthetic Style', key: 'aestheticStyle', descKey: 'aestheticStyleDescription' },
    { label: 'Planet', key: 'planet', descKey: 'planetDescription' },
    { label: 'Time of Day', key: 'timeOfDay', descKey: 'timeOfDayDescription' },
    { label: 'Fictional Character', key: 'fictionalCharacter', descKey: 'fictionalCharacterDescription' },
    { label: 'Zodiac Alignment', key: 'zodiacAlignment', descKey: 'zodiacAlignmentDescription' },
  ];

  return (
    <PageContainer>
      <AccentCircle />
      <AccentCircle />
      <AccentCircle />
      
      {result.profileImage && (
        <ProfileImage>
          <img src={result.profileImage} alt="Profile" />
        </ProfileImage>
      )}
      
      <ContentWrapper>
        <PageTitle>VIBE_RESULTS</PageTitle>
        <Description>{result.briefDescription}</Description>
        
        <ResultsGrid>
          {resultSections.map((item, index) => (
            item.isPokemon ? (
              <PokemonCard key={item.key} index={index}>
                <CardLabel gridArea="label">{item.label}</CardLabel>
                <CardValue gridArea="value">{result[item.key]}</CardValue>
                
                {result.pokemonImage && (
                  <PokemonImage
                    gridArea="img"
                    src={result.pokemonImage}
                    alt={result.pokemonName || result.pokemon}
                  />
                )}
                
                <CardDescription gridArea="desc">{result[item.descKey]}</CardDescription>
              </PokemonCard>
            ) : (
              <ResultCard key={item.key} index={index}>
                <CardLabel>{item.label}</CardLabel>
                <CardValue>{result[item.key]}</CardValue>
                <CardDescription>{result[item.descKey]}</CardDescription>
              </ResultCard>
            )
          ))}
        </ResultsGrid>
        
        {result.roast && (
          <RoastButton onClick={toggleRoast}>
            <span style={{ marginRight: '0.5rem' }}>🔥</span> Reveal Roast
          </RoastButton>
        )}
      </ContentWrapper>
      
      {showRoast && (
        <ModalOverlay onClick={toggleRoast}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={toggleRoast}>
              <X size={20} />
            </CloseButton>
            
            <ModalTitle>🔥 BRUTAL ROAST 🔥</ModalTitle>
            <ModalText>{result.roast}</ModalText>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Results;