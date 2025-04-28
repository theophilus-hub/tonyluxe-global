import { v2 as cloudinary } from 'cloudinary';

// Log Cloudinary configuration (without showing the secret)
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Cloudinary Configuration Details:');
console.log(`- Cloud Name: ${cloudName || 'MISSING'}`);
console.log(`- API Key: ${apiKey ? apiKey.substring(0, 4) + '...' : 'MISSING'}`);
console.log(`- API Secret: ${apiSecret ? 'provided' : 'MISSING'}`);
console.log(`- Environment: ${process.env.NODE_ENV}`);

if (!cloudName || !apiKey || !apiSecret) {
  console.error('⚠️ Cloudinary configuration is incomplete. Please check your .env.local file.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Function to upload image to Cloudinary
export async function uploadImage(imageFile) {
  try {
    console.log('Attempting to upload image to Cloudinary...');
    
    // Verify Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name is missing');
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary API key is missing');
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary API secret is missing');
    }
    
    // Log the current Cloudinary configuration being used
    console.log('Using Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 4) + '...' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'provided' : 'missing'
    });
    
    console.log('Calling Cloudinary API...');
    const uploadOptions = {
      folder: 'tonyluxe',
      resource_type: 'auto' // Automatically detect resource type
    };
    
    console.log('Upload options:', uploadOptions);
    const uploadResponse = await cloudinary.uploader.upload(imageFile, uploadOptions);
    
    console.log('Image uploaded successfully:', uploadResponse.public_id);
    
    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error.message);
    if (error.http_code) {
      console.error(`HTTP Status: ${error.http_code}`);
    }
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

// Function to delete image from Cloudinary
export async function deleteImage(publicId) {
  try {
    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    return deleteResponse;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}

export default cloudinary;
