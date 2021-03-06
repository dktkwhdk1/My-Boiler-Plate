import mongoose from 'mongoose';

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

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
