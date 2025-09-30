import { fetchProducts } from '../services/productService.js'

export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword = '', categoryId } = req.query

        const products = await fetchProducts({
            page,
            limit,
            keyword,
            categoryId,
        })

        res.json({
            page: Number(page),
            limit: Number(limit),
            products,
        })
    } catch (error) {
        console.error('Error in getProducts:', error)
        res.status(500).json({ message: 'Server error' })
    }
}
