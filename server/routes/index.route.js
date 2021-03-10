import { Router } from 'express';
import User from '../models/User.model.js';
import authMiddleware from '../middlewares/auth.middleware.js';

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

    this.router.post(`/api/users/register`, (req, res) => {
      const user = new User(req.body);
      user.save((err, userInfo) => {
        if (err) return res.json({ success: false, message: err });
        return res.status(200).json({ success: true });
      });
    });

    this.router.post('/api/users/login', (req, res) => {
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

    this.router.get('/api/users/auth', authMiddleware, (req, res) => {
      const { _id, email, name, lastname, role, image } = req.user;
      res.status(200).json({
        _id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email,
        name,
        lastname,
        role,
        image,
      });
    });

    this.router.get('/api/users/logout', authMiddleware, (req, res) => {
      User.findOneAndUpdate(
        { _id: req.user._id },
        { token: '' },
        (err, user) => {
          if (err) return res.json({ success: false, message: err });
          return res.status(200).send({
            success: true,
          });
        }
      );
    });

    this.router.get('/api/hello', (req, res) => {
      res.send('hello');
    });
  }
}

export default IndexRoute;

/**
 * 1. Client Cookie에 저장된 Token을 Server에서 가져와서 복호화
 * 2. 복호화 후 UserID가 나오는데 그 UserID를 이용해서 데이터 베이스에서 유저를 찾고, 유저의 쿠키에서 받아온 Token 확인
 * 3. 쿠키가 일치하다면 Authentication True 아니라면 Authentication False
 */
