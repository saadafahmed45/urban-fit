import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

/**
 * Generate signed parameters for direct secure uploads
 */
export function generateSignature(paramsToSign = {}) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!apiSecret) {
    throw new Error('CLOUDINARY_API_SECRET is not configured in environment variables');
  }

  const mergedParams = {
    timestamp,
    ...paramsToSign,
  };

  const signature = cloudinary.utils.api_sign_request(mergedParams, apiSecret);

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  };
}

/**
 * Upload a file buffer or base64 data URI to Cloudinary
 * @param {Buffer|string} fileData - Buffer or base64 data URI
 * @param {Object} options - Upload options (folder, public_id, tags)
 */
export async function uploadImage(fileData, options = {}) {
  const defaultOptions = {
    folder: 'urban-fit/products',
    resource_type: 'image',
    transformation: [
      { quality: 'auto:best' },
      { fetch_format: 'auto' },
    ],
    ...options,
  };

  if (Buffer.isBuffer(fileData)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        defaultOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      );
      uploadStream.end(fileData);
    });
  }

  // If base64 or URL
  const result = await cloudinary.uploader.upload(fileData, defaultOptions);
  return {
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
  };
}

/**
 * Delete an image by its public_id
 */
export async function deleteImage(publicId) {
  if (!publicId) return { result: 'ignored' };
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset [${publicId}]:`, error.message);
    throw error;
  }
}

/**
 * Construct an optimized Cloudinary delivery URL with dynamic width & formatting
 */
export function getOptimizedImageUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return '';
  
  // If it's already an external non-cloudinary URL (e.g. Unsplash or avatar), return as is
  if (publicIdOrUrl.startsWith('http') && !publicIdOrUrl.includes('res.cloudinary.com')) {
    return publicIdOrUrl;
  }

  const { width = 1200, quality = 'auto', format = 'auto', crop = 'limit' } = options;
  
  // If full cloudinary URL, insert transformations
  if (publicIdOrUrl.includes('/upload/')) {
    const parts = publicIdOrUrl.split('/upload/');
    const transform = `f_${format},q_${quality},w_${width},c_${crop}`;
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
  }

  // Otherwise assume it is a public ID
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_${format},q_${quality},w_${width},c_${crop}/${publicIdOrUrl}`;
}

export default cloudinary;
