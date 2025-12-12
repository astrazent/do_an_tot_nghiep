import express from 'express'
import { ColumnController } from '~/controllers/columnController'

const Router = express.Router()

Router.route('/')
    .get(ColumnController.getColumns)
    .post(ColumnController.createColumn)

Router.route('/:id')
    .put(ColumnController.updateColumn)
    .delete(ColumnController.deleteColumn)

export default Router
