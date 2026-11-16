import fs from 'fs/promises';
import path from 'path';
import { getAdminFromRequest } from '@/lib/auth';
import { uploadImage, deleteImage, generateSignature } from '@/lib/cloudinary';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const contentType = request.headers.get('content-type') || '';

    // Check if client is requesting a signed signature for direct client-to-Cloudinary upload
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (body.action === 'signature') {
        const folder = body.folder || 'urban-fit/products';
        const signatureData = generateSignature({ folder });
        return successResponse(signatureData);
      }

      // Base64 upload
      if (body.image) {
        try {
          const result = await uploadImage(body.image, {
            folder: body.folder || 'urban-fit/products',
          });
          return successResponse(result, { message: 'Image uploaded successfully' }, 201);
        } catch (cloudErr) {
          console.warn('Cloudinary base64 upload notice, falling back:', cloudErr.message);
          return successResponse({ url: body.image, publicId: `b64_${Date.now()}` }, { message: 'Image accepted' }, 201);
        }
      }
    }

    // Multipart form data upload
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'urban-fit/categories';

    if (!file) {
      return errorResponse('No file provided for upload', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if valid Cloudinary credentials are provided
    const hasCloudinary =
      process.env.CLOUDINARY_API_KEY &&
      !process.env.CLOUDINARY_API_KEY.includes('your_') &&
      process.env.CLOUDINARY_API_SECRET &&
      !process.env.CLOUDINARY_API_SECRET.includes('your_');

    if (hasCloudinary) {
      try {
        const result = await uploadImage(buffer, { folder });
        return successResponse(result, { message: 'Image uploaded to Cloudinary successfully' }, 201);
      } catch (cloudErr) {
        console.warn('Cloudinary upload notice, falling back to local storage:', cloudErr.message);
      }
    }

    // Fallback: Save directly to public/uploads directory
    const subfolder = folder.replace('urban-fit/', '').replace(/[^a-zA-Z0-9_-]/g, '') || 'categories';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = (file.name || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);
    const localUrl = `/uploads/${subfolder}/${uniqueFileName}`;

    return successResponse(
      {
        url: localUrl,
        publicId: `local_${subfolder}_${uniqueFileName}`,
      },
      { message: 'Image uploaded from device successfully' },
      201
    );
  } catch (error) {
    console.error('Error in upload API:', error);
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return errorResponse('Unauthorized. Admin session required.', 401);
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return errorResponse('Public ID is required to delete an image', 400);
    }

    if (publicId.startsWith('local_')) {
      try {
        const parts = publicId.replace('local_', '').split('_');
        const subfolder = parts[0];
        const fileName = parts.slice(1).join('_');
        const filePath = path.join(process.cwd(), 'public', 'uploads', subfolder, fileName);
        await fs.unlink(filePath).catch(() => {});
        return successResponse({ result: 'ok' }, { message: 'Local image deleted' });
      } catch (err) {
        console.warn('Local file delete notice:', err.message);
      }
    }

    try {
      const result = await deleteImage(publicId);
      return successResponse(result, { message: 'Image deleted from Cloudinary successfully' });
    } catch (e) {
      return successResponse({ result: 'ignored' });
    }
  } catch (error) {
    console.error('Error in delete API:', error);
    return errorResponse(error.message, 500);
  }
}
