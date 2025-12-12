import axios from 'axios'

export const getListProduct = async data => {
    try {
        const response = await axios.get(
            'http://localhost:8023/v1/products/list',
            {
                params: { limit: data.limit, offset: data.offset },
            }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const updateProduct = async data => {
    const { productId, ...updateData } = data
    if (!productId) {
        throw new Error('Thiếu productId để thực hiện cập nhật.')
    }

    try {
        const response = await axios.patch(
            `http://localhost:8023/v1/products/${productId}`,
            updateData
        )
        return response.data
    } catch (error) {
        console.error(
            `Đã xảy ra lỗi khi cập nhật sản phẩm ID ${productId}:`,
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const createProduct = async data => {
    try {
        const response = await axios.post(
            `http://localhost:8023/v1/products`,
            data
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getListCategory = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/category/list`
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getImageforProduct = async productId => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/product_image/by_product`,
            { params: { productId: productId } }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getProductById = async productId => {
    try {
        const response = await axios.get(`http://localhost:8023/v1/products`, {
            params: { productId: productId },
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const createProductImage = async data => {
    try {
        const response = await axios.post(
            `http://localhost:8023/v1/product_image`,
            data
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateProductImage = async (imageId, data) => {
    try {
        const response = await axios.patch(
            `http://localhost:8023/v1/product_image/${imageId}`,
            data
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteProductImage = async imageId => {
    try {
        const response = await axios.delete(
            `http://localhost:8023/v1/product_image`,
            { params: { imageId: imageId } }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getInventoryDashboard = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/products/inventory_dashboard`
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getSoldProductChartByYear = async (year) => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/products/sold_product_chart_by_year`,
            { params: { year: year } }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getProductStockByCategory = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/products/product_stock_by_category`
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getUnsoldProductsThisMonth = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/products/unsold_products_this_month`
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getTop5Customers = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/products/top_5_customers`
        )
        return response.data
    } catch (error) {
        throw error
    }
}