import User from '../models/User.model.js';

/* 인증 처리 담당 */
const authMiddleware = (req, res, next) => {
  let token = req.cookies.x_auth;
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
};

export default authMiddleware;
