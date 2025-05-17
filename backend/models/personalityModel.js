import mongoose from 'mongoose';

const personalitySchema = new mongoose.Schema({
  customId: {
    type: String,
    required: true,
    unique: true
  },
  briefDescription: String,

  corePersonalityArchetype: String,
  corePersonalityArchetypeDescription: String,

  element: String,
  elementDescription: String,

  pokemonDescription: String,
  pokemonName: String, // ✅ Newly added field for lowercase Pokemon name
  pokemonImage: String,

  country: String,
  countryDescription: String,

  aestheticStyle: String,
  aestheticStyleDescription: String,

  planet: String,
  planetDescription: String,

  timeOfDay: String,
  timeOfDayDescription: String,

  fictionalCharacter: String,
  fictionalCharacterDescription: String,

  zodiacAlignment: String,
  zodiacAlignmentDescription: String,

  roast:String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const personalityModel = mongoose.model('PersonalityResult', personalitySchema);
export default personalityModel;
