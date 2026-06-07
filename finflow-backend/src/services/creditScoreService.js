const CreditScore = require("../models/CreditScore");

const getGrade = (score) => {
  if (score >= 800) return "Excellent";
  if (score >= 740) return "Very Good";
  if (score >= 670) return "Good";
  if (score >= 580) return "Fair";
  return "Poor";
};

exports.getCreditScore = async (userId) => {
  let record = await CreditScore.findOne({ user: userId });
  if (!record) {
    // Generate initial score for new users
    const score = Math.floor(Math.random() * 200 + 650);
    record = await CreditScore.create({
      user: userId, score, grade: getGrade(score),
      factors: [
        { name: "Payment History", impact: "positive", description: "No missed payments" },
        { name: "Credit Utilisation", impact: "neutral", description: "Moderate usage" },
      ],
      history: [{ score, recordedAt: new Date() }],
    });
  }
  return record;
};
