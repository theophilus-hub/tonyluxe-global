const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this car'],
    maxlength: [100, 'Title cannot be more than 100 characters']
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
  make: {
    type: String,
    required: [true, 'Please provide the make of the car'],
    maxlength: [50, 'Make cannot be more than 50 characters']
  },
  model: {
    type: String,
    required: [true, 'Please provide the model of the car'],
    maxlength: [50, 'Model cannot be more than 50 characters']
  },
  year: {
    type: Number,
    required: [true, 'Please provide the year of the car'],
    min: [1900, 'Year cannot be less than 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  mileage: {
    type: Number,
    required: [true, 'Please provide the mileage of the car'],
    min: [0, 'Mileage cannot be negative']
  },
  fuelType: {
    type: String,
    required: [true, 'Please provide the fuel type of the car'],
    enum: {
      values: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'],
      message: '{VALUE} is not a valid fuel type'
    }
  },
  transmission: {
    type: String,
    required: [true, 'Please provide the transmission type of the car'],
    enum: {
      values: ['Automatic', 'Manual', 'Semi-Automatic'],
      message: '{VALUE} is not a valid transmission type'
    }
  },
  color: {
    type: String,
    required: [true, 'Please provide the color of the car'],
    maxlength: [50, 'Color cannot be more than 50 characters']
  },
  status: {
    type: String,
    required: [true, 'Please provide the status of the car'],
    enum: {
      values: ['For Sale', 'Sold'],
      message: '{VALUE} is not a valid car status'
    },
    default: 'For Sale'
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    default: []
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

// Update the updatedAt field before saving
CarSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if the model already exists to prevent overwriting
module.exports = mongoose.models.Car || mongoose.model('Car', CarSchema);
