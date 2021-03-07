import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { decode } from 'jsonwebtoken';

const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 20,
  },
  email: {
    type: String,
    trim: true, // space 없애주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 20,
  },
  // 관리자 혹은 일반 유저
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// 유저 모델에 정보를 저장하기 전에 비밀번호 암호화
userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else next();
});

// 비밀번호 비교 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// jsonwebtoken으로 토큰 생성 메소드
userSchema.methods.generateToken = function (cb) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// https://backend-intro.vlpt.us/3/03.html : statics와 methods의 차이
userSchema.statics.findByToken = function (token, cb) {
  const user = this;
  jwt.verify(token, 'secretToken', function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
