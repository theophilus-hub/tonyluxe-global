const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this property'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this property'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this property']
  },
  location: {
    type: String,
    required: [true, 'Please provide a location for this property'],
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please provide the number of bedrooms'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please provide the number of bathrooms'],
    min: [0, 'Bathrooms cannot be negative']
  },
  squareFootage: {
    type: Number,
    required: [true, 'Please provide the square footage'],
    min: [0, 'Square footage cannot be negative']
  },
  features: {
    type: [String],
    default: []
  },
  propertyType: {
    type: String,
    required: [true, 'Please provide the property type'],
    enum: {
      values: ['House', 'Apartment', 'Condo', 'Townhouse', 'Villa', 'Land', 'Commercial', 'Other'],
      message: '{VALUE} is not a valid property type'
    }
  },
  status: {
    type: String,
    required: [true, 'Please provide the property status'],
    enum: {
      values: ['For Sale', 'Sold', 'For Rent', 'Rented'],
      message: '{VALUE} is not a valid property status'
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
PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if the model already exists to prevent overwriting
module.exports = mongoose.models.Property || mongoose.model('Property', PropertySchema);
