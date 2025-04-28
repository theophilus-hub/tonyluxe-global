import { getToken } from 'next-auth/jwt';
import { uploadImage } from '../../../lib/cloudinary';
import { formidable } from 'formidable';
import fs from 'fs';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('Upload API called');
  
  // Check authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('Auth token:', token ? 'Valid' : 'Invalid', 'Role:', token?.role);
  
  // Only manager can upload images
  if (!token || token.role !== 'manager') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  try {
    console.log('Parsing form data...');
    // Parse the incoming form data
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      multiples: true, // Support multiple file uploads
      allowEmptyFiles: false,
    });
    
    // Log environment variables (without showing full secrets)
    console.log('Environment check:');
    console.log('- CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'missing');
    console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 4) + '...' : 'missing');
    console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'provided' : 'missing');
    
    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          res.status(500).json({ error: 'Error parsing form data' });
          return resolve();
        }
        
        try {
          const uploadedImages = [];
          
          // Handle multiple files
          console.log('Files received:', files ? 'yes' : 'no');
          console.log('Files object keys:', files ? Object.keys(files) : 'none');
          
          // Check if files is in the new or old format (formidable v4 vs older)
          let fileArray = [];
          
          if (files.images) {
            // Old format
            fileArray = Array.isArray(files.images) ? files.images : [files.images];
          } else if (files.file) {
            // New format with 'file' key
            fileArray = Array.isArray(files.file) ? files.file : [files.file];
          } else {
            // Try to get the first file from any available key
            const firstKey = Object.keys(files)[0];
            if (firstKey) {
              fileArray = Array.isArray(files[firstKey]) ? files[firstKey] : [files[firstKey]];
            }
          }
            
          console.log(`Number of files to process: ${fileArray.length}`);
          
          for (const file of fileArray) {
            // Read file from disk
            const fileData = fs.readFileSync(file.filepath);
            
            // Convert to base64 for Cloudinary
            const base64Data = `data:${file.mimetype};base64,${fileData.toString('base64')}`;
            
            // Upload to Cloudinary
            console.log(`Uploading image: ${file.originalFilename}, size: ${file.size} bytes, type: ${file.mimetype}`);
            const result = await uploadImage(base64Data);
            
            if (!result || !result.url) {
              throw new Error('Upload succeeded but returned invalid result');
            }
            
            uploadedImages.push({
              url: result.url,
              public_id: result.public_id,
            });
            
            console.log(`Successfully uploaded image: ${result.public_id}`);
            
            // Clean up temp file
            fs.unlinkSync(file.filepath);
          }
          
          res.status(200).json({ images: uploadedImages });
          return resolve();
        } catch (error) {
          console.error('Error uploading images:', error.message);
          if (error.stack) {
            console.error(error.stack);
          }
          res.status(500).json({ error: `Error uploading images: ${error.message}` });
          return resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error in upload handler:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
