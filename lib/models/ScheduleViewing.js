import mongoose from 'mongoose';

const ScheduleViewingSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true,
  },
  propertyTitle: {
    type: String,
  },
  tourType: {
    type: String,
    enum: ['in-person', 'video'],
    default: 'in-person',
  },
  preferredDate: {
    type: String,
  },
  preferredTime: {
    type: String,
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
    required: true,
    trim: true,
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['new', 'confirmed', 'completed', 'cancelled'],
    default: 'new',
    index: true,
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

ScheduleViewingSchema.pre('save', function () {
  this.updatedAt = new Date();
});

ScheduleViewingSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

export default mongoose.models.ScheduleViewing || mongoose.model('ScheduleViewing', ScheduleViewingSchema);

