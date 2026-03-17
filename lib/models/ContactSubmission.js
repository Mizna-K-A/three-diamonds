import mongoose from 'mongoose';

const ContactSubmissionSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['contact-page', 'brochure-download', 'property-contact', 'contact-section'],
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

// In development, handle schema updates by deleting the model from cache if it exists
if (process.env.NODE_ENV === 'development' && mongoose.models.ContactSubmission) {
  delete mongoose.models.ContactSubmission;
}

const ContactSubmission = mongoose.models.ContactSubmission || mongoose.model('ContactSubmission', ContactSubmissionSchema);

export default ContactSubmission;


