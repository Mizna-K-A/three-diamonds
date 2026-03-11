import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a tag name'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    trim: true,
    lowercase: true,
    unique: true, // Added unique constraint for slugs
  },
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#6b7280',
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

TagSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

TagSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

// Delete cached model so schema changes take effect immediately
delete mongoose.models.Tag;

export default mongoose.model('Tag', TagSchema);