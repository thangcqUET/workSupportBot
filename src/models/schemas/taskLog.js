const { Schema } = require('mongoose');

const TaskLogSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = TaskLogSchema;
