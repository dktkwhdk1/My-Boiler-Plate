import { Router } from 'express';
import User from '../models/User.model.js';

class IndexRoute {
  path = '/';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, (req, res) => {
      res.send('hello');
    });

    this.router.post(`/register`, (req, res) => {
      const user = new User(req.body);
      user.save((err, userInfo) => {
        if (err) return res.json({ success: false, message: err });
        return res.status(200).json({ success: true });
      });
    });

    this.router.post('/login', (req, res) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          return res.json({
            loginSuccess: false,
            message: '제공된 이메일에 해당하는 유저가 없습니다.',
          });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            return res.json({
              loginSuccess: false,
              message: '비밀번호가 틀렸습니다.',
            });
          }

          // 비밀번호까지 맞으면 토큰 생성
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);

            // 토큰 저장(쿠키, 세션, 로컬스토리지 등)
            res.cookie('x_auth', user.token).status(200).json({
              loginSuccess: true,
              userId: user._id,
            });
          });
        });
      });
    });
  }
}

export default IndexRoute;
