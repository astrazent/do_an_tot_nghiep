import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

cloudinary.config({
    cloud_name: 'tienduy2003',
    api_key: '225841868995845',
    api_secret: 'vFg_IUlqLAfHXTsW3LHCDzfgqOA',
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

const uploadCloudinary = async (req, res, next) => {
    try {
        const images = req.files
        if (!images || images.length === 0) {
            return res
                .status(400)
                .json({ message: 'Không có tệp tin nào được tải lên' })
        }

        const uploadPromises = images.map(file => {
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
            return cloudinary.uploader.upload(base64Image, {
                folder: 'products',
            })
        })

        const results = await Promise.all(uploadPromises)
        req.uploadedImageUrls = results.map(r => r.secure_url)
        next()
    } catch (error) {
        console.error('Lỗi upload Cloudinary:', error)
        res.status(500).json({ message: 'Upload thất bại' })
    }
}

export { upload, uploadCloudinary }
