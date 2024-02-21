const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // id: {
  //   type: Number,
  //   autoIncrement: true,
  //   allowNull: false,
  //   primaryKey: true,
  // },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;


