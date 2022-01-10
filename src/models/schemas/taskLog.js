const { Schema } = require('mongoose');

const TaskLogSchema = new Schema({
  taskLogId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
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
