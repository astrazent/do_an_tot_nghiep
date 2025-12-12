import { StatusCodes } from 'http-status-codes'
import { shipmentService } from '~/services/shipmentService'

const addShipment = async (req, res, next) => {
    try {
        const data = await shipmentService.addShipmentService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Thêm phương thức giao hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getShipmentById = async (req, res, next) => {
    try {
        const data = await shipmentService.getShipmentByIdService(
            req.query.shipmentId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức giao hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getShipmentByName = async (req, res, next) => {
    try {
        const data = await shipmentService.getShipmentByNameService(
            req.query.shipmentName
        )
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức giao hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getAllShipments = async (req, res, next) => {
    try {
        const data = await shipmentService.getAllShipmentsService()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách phương thức giao hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateShipment = async (req, res, next) => {
    try {
        const data = await shipmentService.updateShipmentService(
            req.query.shipmentId,
            req.body
        )
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật phương thức giao hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getActiveShipment = async (req, res, next) => {
    try {
        const data = await shipmentService.getActiveShipmentService()
        return res.status(StatusCodes.OK).json({
            message: 'Lấy phương thức giao hàng đang hoạt động thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}
export const shipmentController = {
    addShipment,
    getShipmentById,
    getShipmentByName,
    getAllShipments,
    updateShipment,
    getActiveShipment,
}
