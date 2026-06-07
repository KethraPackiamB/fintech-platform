const KYC = require("../models/KYC");

exports.submitKYC = async (userId, data, documents) => {
  const docs = [];
  if (documents) {
    if (Array.isArray(documents)) {
      documents.forEach((f) => {
        docs.push({ docType: f.fieldname, url: f.path, uploadedAt: new Date() });
      });
    } else if (typeof documents === "object") {
      Object.keys(documents).forEach((key) => {
        const files = documents[key];
        if (Array.isArray(files)) {
          files.forEach((f) => {
            docs.push({ docType: f.fieldname, url: f.path, uploadedAt: new Date() });
          });
        } else if (files) {
          docs.push({ docType: files.fieldname, url: files.path, uploadedAt: new Date() });
        }
      });
    }
  }
  return KYC.findOneAndUpdate(
    { user: userId },
    { ...data, documents: docs, status: "pending", user: userId },
    { upsert: true, new: true }
  );
};

exports.getKYC = (userId) => KYC.findOne({ user: userId });

exports.verifyKYC = (userId, status, remarks) =>
  KYC.findOneAndUpdate(
    { user: userId },
    { status, remarks, ...(status === "verified" ? { verifiedAt: new Date() } : {}) },
    { new: true }
  );
