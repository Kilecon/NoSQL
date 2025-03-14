const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  dates: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date
    }
  },
  description: {
    type: String
  }
}, { timestamps: true });

const InformationSchema = new Schema({
  bio: {
    type: String
  },
  location: {
    type: String
  },
  website: {
    type: String
  }
});

const ProfileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  experience: [ExperienceSchema],
  skills: [String],
  information: InformationSchema,
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
module.exports = mongoose.model('Profile', ProfileSchema);