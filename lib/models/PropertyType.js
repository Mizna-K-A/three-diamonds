import mongoose from 'mongoose';

const PropertyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    sparse: true
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Fix 1: Use function declaration instead of arrow function
// Fix 2: Don't use the 'next' parameter if not needed
PropertyTypeSchema.pre('save', function() {
  this.updatedAt = new Date();
  // No need to call next() - just return
});

// For findOneAndUpdate operations
PropertyTypeSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// For updateOne operations
PropertyTypeSchema.pre('updateOne', function() {
  this.set({ updatedAt: new Date() });
});

export default mongoose.models.PropertyType || mongoose.model('PropertyType', PropertyTypeSchema);