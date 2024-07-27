import express from 'express'

import { getOrders, getOrderById, addOrder, updateOrder, removeOrder, addOrderMsg, removeOrderMsg } from './order.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

const router = express.Router()

router.get('/', log, getOrders)
router.get('/:id', log, getOrderById)
router.post('/', log, addOrder)
router.put('/:id', updateOrder)
router.delete('/:id', removeOrder)

router.post('/:id/msg', requireAuth, addOrderMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeOrderMsg)

export const orderRoutes = router
