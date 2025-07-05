import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this property'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
    unique: [true, 'A property with this title already exists'],
    trim: true
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
  currency: {
    type: String,
    required: [true, 'Please provide a currency for this property'],
    enum: ['NGN', 'USD'],
    default: 'NGN'
  },
  location: {
    type: String,
    required: [true, 'Please provide a location for this property'],
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please provide the number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please provide the number of bathrooms']
  },
  squareFootage: {
    type: Number,
    required: [true, 'Please provide the square footage']
  },
  propertyType: {
    type: String,
    required: [true, 'Please provide the property type'],
    enum: [
      'Apartment',
      'House',
      'Villa',
      'Condo (Condominium)',
      'Duplex',
      'Penthouse',
      'Studio',
      'Bungalow',
      'Townhouse',
      'Land',
      'Commercial Property',
      'Office Space',
      'Retail',
      'Hotel/Guest House',
      'Warehouse',
      'Industrial Property',
      'Farm',
      'Short Let'
    ]
  },
  status: {
    type: String,
    required: [true, 'Please provide the property status'],
    enum: ['For Sale', 'For Rent', 'Sold', 'Rented', 'Available', 'Taken']
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one image URL']
  },
  interiorFeatures: {
    type: [String],
    default: []
  },
  exteriorFeatures: {
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

// Update the updatedAt field on save
PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);
