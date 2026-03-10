import mongoose from 'mongoose';

const ContactSubmissionSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['contact-page', 'brochure-download', 'property-contact'],
    default: 'contact-page',
    index: true,
  },
  pagePath: {
    type: String,
    default: '',
  },
  propertyType: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  message: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export default mongoose.models.ContactSubmission ||
  mongoose.model('ContactSubmission', ContactSubmissionSchema);

