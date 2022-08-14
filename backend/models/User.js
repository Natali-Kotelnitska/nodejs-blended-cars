const { model, Schema } = require('mongoose');

const userSchema = Schema(
  {
    username: String,
    userEmail: {
      type: String,
      unique: true,
    },
    userPassword: String,
    token: {
      type: String,
      default: null,
    },
    // userRoles: [],
    hobbies: [],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('user', userSchema);
