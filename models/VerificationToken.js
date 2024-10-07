
// Define the VerificationToken schema
const verificationTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.employerId;
    }
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: function() {
      return !this.userId;
    }
  },
  expiresAt: {
    type: Date,
    required: true,
  }
});

// Create the VerificationToken model
const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

module.exports = VerificationToken;