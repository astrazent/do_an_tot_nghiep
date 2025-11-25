import { CategoriesModel } from '~/models/categoryModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createCategoryService = async data => {
    const existingCategory = await CategoriesModel.getCategoryByName(data.name)
    if (existingCategory) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            `Danh mục với tên '${data.name}' đã tồn tại. Vui lòng chọn tên khác.`
        )
    }

    const newCategory = await CategoriesModel.createCategory(data)
    return newCategory
}

const getByIdCategoryService = async categoryId => {
    const category = await CategoriesModel.getCategoryById(categoryId)
    if (!category) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy danh mục với ID '${categoryId}'.`
        )
    }

    return category
}

const getBySlugCategoryService = async slug => {
    const category = await CategoriesModel.getCategoryBySlug(slug.slug)
    if (!category) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy danh mục với slug '${slug}'.`
        )
    }

    return category
}

const getListCategoryService = async () => {
    const categories = await CategoriesModel.listCategories()
    if (categories.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không có danh mục nào trong hệ thống.'
        )
    }

    return categories
}

const updateCategoryService = async (categoryId, data) => {
    const existingCategory = await CategoriesModel.getCategoryById(categoryId)
    if (!existingCategory) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy danh mục với ID '${categoryId}'.`
        )
    }

    const updatedCategory = await CategoriesModel.updateCategory(
        categoryId,
        data
    )
    return updatedCategory
}

const deleteCategoryService = async categoryId => {
    const existingCategory = await CategoriesModel.getCategoryById(categoryId)
    if (!existingCategory) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy danh mục với ID '${categoryId}'.`
        )
    }

    await CategoriesModel.deleteCategory(categoryId)
    return { message: `Xóa danh mục với ID '${categoryId}' thành công.` }
}

export const categoryService = {
    createCategoryService,
    getByIdCategoryService,
    getBySlugCategoryService,
    getListCategoryService,
    updateCategoryService,
    deleteCategoryService,
}
