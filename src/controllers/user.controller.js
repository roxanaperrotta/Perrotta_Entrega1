import User from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils.js';

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.redirect('/login?error=1');
  }

  const token = generateToken(user);
  res.cookie('currentUser', token, { signed: true, httpOnly: true });
  res.redirect('/current');
};

