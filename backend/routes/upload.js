const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, authorize } = require('../middleware/auth');

// Cấu hình multer để lưu file tạm trong memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh'
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'tea-coffee-shop',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      success: true,
      message: 'Upload thành công',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi upload ảnh'
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, authorize('admin'), upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất 1 file ảnh'
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'tea-coffee-shop',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'Upload thành công',
      images: results
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi upload ảnh'
    });
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:public_id
// @access  Private/Admin
router.delete('/:public_id', protect, authorize('admin'), async (req, res) => {
  try {
    const { public_id } = req.params;
    
    await cloudinary.uploader.destroy(public_id);

    res.json({
      success: true,
      message: 'Xóa ảnh thành công'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ảnh'
    });
  }
});

// @desc    Upload avatar for user
// @route   POST /api/upload/avatar
// @access  Private (any logged in user)
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh'
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'tea-coffee-shop/avatars',
      resource_type: 'auto',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    res.json({
      success: true,
      message: 'Upload avatar thành công',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi upload avatar'
    });
  }
});

module.exports = router;
