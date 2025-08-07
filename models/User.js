import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // For future auth
  savedCities: [String],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
