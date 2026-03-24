import mongoose from 'mongoose';

const creditScoreSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      required: true,
    },
    factors: {
      paymentHistory: Number,
      creditUtilization: Number,
      historyLength: Number,
      creditMix: Number,
      newCredit: Number,
    },
    changes: {
      previousScore: Number,
      changePercentage: Number,
    },
    recommendations: [String],
  },
  { timestamps: true }
);

export default mongoose.model('CreditScore', creditScoreSchema);

