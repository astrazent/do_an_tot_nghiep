import { ShipmentsModel } from '~/models/shipmentModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { shipmentController } from '~/controllers/shipmentController'

const addShipmentService = async data => {
    const existed = await ShipmentsModel.getShipmentByName(data.name)
    if (existed) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            'Phương thức giao hàng này đã tồn tại'
        )
    }
    const newShipment = await ShipmentsModel.createShipment(data)
    return newShipment
}

const getShipmentByIdService = async shipmentId => {
    const payment = await ShipmentsModel.getShipmentById(shipmentId)
    if(!payment){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy phương thức giao hàng'
        )
    }
    return payment
}

const getAllShipmentsService = async () => {
    const payments = await ShipmentsModel.listShipments()
    return payments
}

const updateShipmentService = async (shipmentId,data) => {
    const existed = await ShipmentsModel.getShipmentById(shipmentId)
    if(!existed){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy phương thức giao hàng'
        )
    }

    const updateShipment = await ShipmentsModel.updateShipment(shipmentId,data)
    return updateShipment
}

const getActiveShipmentService = async(status) => {
    const activeShipment = await ShipmentsModel.getActiveShipments()
    if(!activeShipment){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy phương thức giao hàng nào đang hoạt động'
        )
    }
    return activeShipment
}

export const shipmentService = {
    addShipmentService,
    getShipmentByIdService,
    getAllShipmentsService,
    updateShipmentService,
    getActiveShipmentService
}
