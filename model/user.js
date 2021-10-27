const { Schema, model } = require('mongoose');
const { Gender } = require('../config/constant');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Guest',
    },
    email: {
      type: String,
      required: [true, 'Set email for user'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    gender: {
      type: String,
      enum: {
        values: [Gender.MALE, Gender.FEMALE, Gender.NONE],
        message: 'Gender not allowed',
      },
      default: Gender.NONE,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

//* "Cолим" пароль
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt); //*  // шифруем пароль, превращаем в хеш
  }
  next();
});

//* пишем метод для проверки пароля при логинизации
userSchema.methods.isValidPassword = async function (password) {
  //* сравнение паролей, на выходе булиан
  return bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
