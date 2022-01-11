const { Schema } = require('mongoose');

const UserSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  username:{
    type:String,
    required: false,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = UserSchema;
