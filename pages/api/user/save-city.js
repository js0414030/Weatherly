import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, city } = req.body;
  if (!email || !city) return res.status(400).json({ error: 'Email and city required' });
  await dbConnect();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, savedCities: [city] });
  } else {
    if (!user.savedCities.includes(city)) {
      user.savedCities.push(city);
      await user.save();
    }
  }
  res.status(200).json({ savedCities: user.savedCities });
}
