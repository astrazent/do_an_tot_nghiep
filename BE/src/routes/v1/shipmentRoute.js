import express from 'express'
import { shipmentController } from '~/controllers/shipmentController'
import { shipmentValidation } from '~/validations/shipmentValidation'
const Router = express.Router()

Router.route('/').post(shipmentValidation.validateShipment, shipmentController.addShipment) 

Router.route('/').get(shipmentController.getShipmentById)

Router.route('/getAll').get(shipmentController.getAllShipments)

Router.route('/active').get(shipmentController.getActiveShipment)

Router.route('/').patch(shipmentController.updateShipment)

export default Router
