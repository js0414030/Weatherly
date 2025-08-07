import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });
  await dbConnect();
  const user = await User.findOne({ email });
  res.status(200).json({ savedCities: user?.savedCities || [] });
}
