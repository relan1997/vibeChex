import fetch from 'node-fetch';
const validatePokemon = async (name) => {
  const formatted = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${formatted}`);
    if (res.ok) {
      return formatted;
    }
  } catch (err) {
    console.warn("PokéAPI validation failed:", err);
  }
  return null;
};
export default validatePokemon;