const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  user: { type: String, required: true },
  votes: [{ type: String }]
});

module.exports = mongoose.model('Voter', VoterSchema);
