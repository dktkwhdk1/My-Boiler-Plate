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
      console.log('user', user);
      console.log('req.body', req.body);
      user.save((err, userInfo) => {
        if (err) return res.json({ success: false, message: err });
        return res.status(200).json({ success: true });
      });
    });
  }
}

export default IndexRoute;
