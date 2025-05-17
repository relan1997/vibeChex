import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Results = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for customId:', id);
        const backendUrl = "http://localhost:1997";
        const res = await axios.get(`${backendUrl}/api/${id}/personality`);
        console.log('Response received:', res.data);
        setResult(res.data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    if (id) fetchData();
    else console.warn("No customId in query params!");
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!result) return <div>No result found.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Personality Result</h1>

      {result.imageUrl && (
        <img
          src={result.imageUrl}
          alt="Personality Visual"
          className="w-full max-h-[400px] object-cover rounded-xl shadow mb-6"
        />
      )}

      <p className="mb-6 text-gray-700 italic">{result.briefDescription}</p>

      {[
        { label: 'Core Personality Archetype', key: 'corePersonalityArchetype', descKey: 'corePersonalityArchetypeDescription' },
        { label: 'Element', key: 'element', descKey: 'elementDescription' },
        { label: 'Pokemon', key: 'pokemon', descKey: 'pokemonDescription' },
        { label: 'Country', key: 'country', descKey: 'countryDescription' },
        { label: 'Aesthetic Style', key: 'aestheticStyle', descKey: 'aestheticStyleDescription' },
        { label: 'Planet', key: 'planet', descKey: 'planetDescription' },
        { label: 'Time of Day', key: 'timeOfDay', descKey: 'timeOfDayDescription' },
        { label: 'Fictional Character', key: 'fictionalCharacter', descKey: 'fictionalCharacterDescription' },
        { label: 'Zodiac Alignment', key: 'zodiacAlignment', descKey: 'zodiacAlignmentDescription' },
      ].map((item) => (
        <div key={item.key} className="mb-6">
          <h2 className="text-xl font-semibold">
            {item.label}: {result[item.key]}
          </h2>
          <p className="text-gray-600">{result[item.descKey]}</p>
        </div>
      ))}
    </div>
  );
};

export default Results;
