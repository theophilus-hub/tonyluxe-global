import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this car'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    unique: [true, 'A car with this title already exists'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this car'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this car']
  },
  currency: {
    type: String,
    required: [true, 'Please provide a currency for this car'],
    enum: ['NGN', 'USD'],
    default: 'NGN'
  },
  location: {
    type: String,
    required: [true, 'Please provide a location for this car'],
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  make: {
    type: String,
    required: [true, 'Please provide the car make']
  },
  model: {
    type: String,
    required: [true, 'Please provide the car model']
  },
  year: {
    type: Number,
    required: [true, 'Please provide the car year']
  },
  mileage: {
    type: Number,
    required: [true, 'Please provide the car mileage']
  },
  fuelType: {
    type: String,
    required: [true, 'Please provide the fuel type'],
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other']
  },
  transmission: {
    type: String,
    required: [true, 'Please provide the transmission type'],
    enum: ['Automatic', 'Manual', 'Semi-Automatic']
  },
  color: {
    type: String,
    required: [true, 'Please provide the car color']
  },
  condition: {
    type: String,
    required: [true, 'Please provide the car condition'],
    enum: ['New', 'Used'],
    default: 'Used'
  },
  status: {
    type: String,
    required: [true, 'Please provide the car status'],
    enum: ['For Sale', 'Sold']
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one image URL']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
CarSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
