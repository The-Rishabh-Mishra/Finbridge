import mongoose from 'mongoose';

const scoreHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 300,
      max: 900,
    },
    previousScore: Number,
    change: Number,
    activity: String,
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('ScoreHistory', scoreHistorySchema);

