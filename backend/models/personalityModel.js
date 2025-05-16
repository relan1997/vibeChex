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

  pokemon: String,
  pokemonDescription: String,

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

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const personalityModel =mongoose.model('PersonalityResult', personalitySchema);
export default personalityModel;
