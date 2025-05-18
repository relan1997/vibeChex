import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { X, Home } from "lucide-react";
import styled, { keyframes } from "styled-components";

// Animations from HomePage
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const CopyLinkButton = styled.button`
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
    width: 420px;
    height: 420px;
    background: #3a3f47;
    top: -120px;
    left: -140px;
    animation-delay: 0s;
  }
  &:nth-child(2) {
    width: 260px;
    height: 260px;
    background: #bfc1c2;
    bottom: 80px;
    right: -100px;
    animation-delay: 3s;
  }
  &:nth-child(3) {
    width: 180px;
    height: 180px;
    background: #232526;
    top: 60%;
    left: 10vw;
    animation-delay: 5s;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 3rem auto 2rem;
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
  text-shadow: 0 1.5px 8px rgba(255, 255, 255.1), 0 1px 0 #18191a;
  text-align: center;
  transition: font-size 0.2s;

  @media (max-width: 900px) {
    font-size: 2.5rem;
  }
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const TitleGlow = styled.span`
  color: #e0e0e0;
  text-shadow: 0 0 15px #bfc1c280, 0 0 25px #bfc1c240;
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

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
  color: #bfc1c2;
  text-align: center;
  transition: font-size 0.2s;
  opacity: 0.9;

  @media (max-width: 600px) {
    font-size: 1.2rem;
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

// Flip Card Container
const FlipCardContainer = styled.div`
  perspective: 1000px;
  animation: ${popIn} 0.5s ease-out forwards;
  animation-delay: ${(props) => props.index * 0.1}s;
  opacity: 0;
  height: 230px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Flip Card Inner Container
const FlipCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  transform: ${(props) => (props.isFlipped ? "rotateY(180deg)" : "rotateY(0)")};
  cursor: pointer;
`;

// Common style for both front and back of the card
const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Front of the card
const CardFront = styled(CardSide)`
  background: linear-gradient(135deg, #232526 0%, #18191a 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #18191a 0%, #232526 100%);
  }
`;

// Back of the card
const CardBack = styled(CardSide)`
  background: linear-gradient(135deg, #18191a 0%, #232526 100%);
  transform: rotateY(180deg);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

// Updated Pokemon Card special layout for front
const PokemonCardFront = styled(CardFront)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const CardLabel = styled.h2`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #bfc1c2;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 600;
`;

const EngagingPrompt = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  margin-top: 0.5rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.02em;
  opacity: 0.85;
`;

const CardValue = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: #e0e0e0;
  margin-bottom: 0.75rem;
  letter-spacing: 0.03em;
`;

const CardDescription = styled.p`
  font-size: 0.85rem;
  color: #8a8d91;
  text-align: center;
  line-height: 1.4;
  max-width: 90%;
`;

const CardFlipHint = styled.p`
  position: absolute;
  bottom: 0.5rem;
  width: 100%;
  text-align: center;
  font-size: 0.7rem;
  color: #8a8d91;
  opacity: 0.7;
  font-style: italic;
`;

// Updated Pokemon Image to be circular
const PokemonImage = styled.img`
  width: 10rem;
  height: 10rem;
  object-fit: cover;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  padding: 0.25rem;
  margin: 0.75rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const HomeButton = styled(Link)`
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(90deg, #232526 0%, #18191a 100%);
  border: 2px solid #bfc1c2;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #e0e0e0;
  transition: transform 0.2s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    color: #bfc1c2;
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

const TwitterButton = styled.button`
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
  margin-top: 1rem;
  z-index: 1;

  &:hover {
    background: linear-gradient(90deg, #18191a 0%, #232526 100%);
    color: #bfc1c2;
    box-shadow: 0 0 36px 6px #bfc1c240;
    transform: translateY(-2px) scale(1.04);
  }
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
  const [flippedCards, setFlippedCards] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${backendUrl}/api/${id}/personality`);
        console.log("Fetched data:", res.data);
        setResult(res.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const toggleRoast = () => setShowRoast(!showRoast);
  const toggleFlip = (key) =>
    setFlippedCards((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading)
    return (
      <LoadingContainer>
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
        <LoadingCard>
          <LoadingText>NO RESULT FOUND</LoadingText>
        </LoadingCard>
      </LoadingContainer>
    );

const resultSections = [
    {
      label: "Core Personality Archetype",
      key: "corePersonalityArchetype",
      descKey: "corePersonalityArchetypeDescription",
    },
    { label: "Element", key: "element", descKey: "elementDescription" },
    {
      label: "Pokemon",
      key: "pokemon",
      descKey: "pokemon", // Just show the Pokemon name here
      isPokemon: true,
      imageUrl: result.pokemonImage, // Add the image URL
      pokemonName: result.pokemonName, // Add the Pokemon name
    },
    { label: "Country", key: "country", descKey: "countryDescription" },
    {
      label: "Aesthetic Style",
      key: "aestheticStyle",
      descKey: "aestheticStyleDescription",
    },
    { label: "Planet", key: "planet", descKey: "planetDescription" },
    { 
      label: "Pokemon Description",
      key: "pokemonDesc",
      descKey: "pokemonDescription", // Add a dedicated card for Pokemon description
    },
    { label: "Time of Day", key: "timeOfDay", descKey: "timeOfDayDescription" },
    {
      label: "Fictional Character",
      key: "fictionalCharacter",
      descKey: "fictionalCharacterDescription",
    },
    {
      label: "Zodiac Alignment",
      key: "zodiacAlignment",
      descKey: "zodiacAlignmentDescription",
    },
  ];

  return (
    <PageContainer>
      <AccentCircle />
      <AccentCircle />
      <AccentCircle />
      
      {/* Add Home Button */}
      <HomeButton to="/">
        <Home size={24} />
      </HomeButton>
      
      {result.profileImage && (
        <ProfileImage>
          <img src={result.profileImage} alt="Profile" />
        </ProfileImage>
      )}

      <ContentWrapper>
        <PageTitle>
          VIBE<TitleGlow>_</TitleGlow>RESULTS
        </PageTitle>
        <Description>{result.briefDescription}</Description>
        <Subtitle>Click the cards to reveal your personality profile</Subtitle>

        <ResultsGrid>
  {resultSections.map((item, index) => (
    <FlipCardContainer key={item.key} index={index}>
      <FlipCardInner
        isFlipped={flippedCards[item.key]}
        onClick={() => toggleFlip(item.key)}
      >
        {item.isPokemon ? (
          <PokemonCardFront>
            <CardLabel>{item.label}</CardLabel>
            <EngagingPrompt>Your Pokemon companion is:</EngagingPrompt>
          </PokemonCardFront>
        ) : (
          <CardFront>
            <CardLabel>{item.label}</CardLabel>
            <EngagingPrompt>{`Click to reveal ${item.label.toLowerCase()}`}</EngagingPrompt>
          </CardFront>
        )}
        <CardBack>
          {item.isPokemon ? (
            <>
              <CardLabel>{result.pokemonName.charAt(0).toUpperCase() + result.pokemonName.slice(1)}</CardLabel>
              <CardValue>{result[item.descKey]}</CardValue>
              {item.imageUrl && <PokemonImage src={item.imageUrl} alt={result.pokemonName} />}
            </>
          ) : (
            <>
              <CardLabel>{item.key === "pokemonDesc" ? "Pokemon Traits" : result[item.key]}</CardLabel>
              <CardValue>{result[item.descKey]}</CardValue>
              {item.imageUrl && <PokemonImage src={item.imageUrl} alt={result[item.key]} />}
            </>
          )}
        </CardBack>
      </FlipCardInner>
    </FlipCardContainer>
  ))}
</ResultsGrid>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginTop: '2rem',
          flexWrap: 'wrap' 
        }}>
          <CopyLinkButton
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
          >
            Copy Sharable Link
          </CopyLinkButton>

          {result.roast && (
            <RoastButton onClick={toggleRoast}>Reveal Roast</RoastButton>
          )}

          <TwitterButton
            onClick={() => {
              const text = encodeURIComponent(
                "🔥 OMG I just discovered my TRUE personality vibe and I'm SHOOK!! 🤯 Had to share my results - take the quiz NOW and find your vibe match!! #VibeCheck #PersonalityReveal #ThisIsSOMe"
              );
              const url = encodeURIComponent(window.location.href);
              const hashtags = "personalitytest,vibes,results";
              window.open(
                `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                "_blank"
              );
            }}
          >
            Share on Twitter
          </TwitterButton>
        </div>
      </ContentWrapper>

      {showRoast && (
        <ModalOverlay onClick={toggleRoast}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={toggleRoast}>
              <X size={20} />
            </CloseButton>
            <ModalTitle>Personality Roast</ModalTitle>
            <ModalText>{result.roast}</ModalText>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Results;