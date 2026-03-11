import mongoose from 'mongoose';

const PropertyStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a status name'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    trim: true,
    lowercase: true,
    sparse: true
  },
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#6b7280',
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt
});

// Helper methods if needed
PropertyStatusSchema.statics.getBySlug = function(slug) {
  return this.findOne({ slug });
};

PropertyStatusSchema.statics.getAllStatuses = function() {
  return this.find().sort({ name: 1 });
};

// Delete cached model so schema changes take effect immediately
delete mongoose.models.PropertyStatus;

export default mongoose.model('PropertyStatus', PropertyStatusSchema);