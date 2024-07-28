import { ObjectId } from 'mongodb'
import { logger } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'

export const orderService = {
  remove,
  query,
  getById,
  add,
  update,
  addOrderMsg,
  removeOrderMsg,
}

async function query(filterBy = { txt: '', status: '' }) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('order')
    const orders = await collection.find(criteria).toArray()
    return orders
  } catch (err) {
    logger.error('cannot find orders', err)
    throw err
  }
}

async function getById(orderId) {
  try {
    const criteria = { _id: ObjectId.createFromHexString(orderId) }
    const collection = await dbService.getCollection('order')
    const order = await collection.findOne(criteria)
    return order
  } catch (err) {
    logger.error(`while finding order ${orderId}`, err)
    throw err
  }
}

async function remove(orderId) {
  try {
    const criteria = { _id: ObjectId.createFromHexString(orderId) }
    const collection = await dbService.getCollection('order')
    const res = await collection.deleteOne(criteria)
    if (res.deletedCount === 0) throw new Error('Not your order')
    return orderId
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

async function add(order) {
  try {
    const collection = await dbService.getCollection('order')
    await collection.insertOne(order)
    return order
  } catch (err) {
    logger.error('cannot insert order', err)
    throw err
  }
}

async function update(order) {
  try {
    const criteria = { _id: new ObjectId(order._id) }
    const { _id, ...orderData } = order
    const collection = await dbService.getCollection('order')
    const { modifiedCount } = await collection.updateOne(criteria, { $set: orderData })
    if (modifiedCount === 0) throw new Error('Order not found')
    return order
  } catch (err) {
    logger.error(`cannot update order ${order._id}`, err)
    throw err
  }
}

async function addOrderMsg(orderId, msg) {
  try {
    const criteria = { _id: ObjectId.createFromHexString(orderId) }
    const collection = await dbService.getCollection('order')
    await collection.updateOne(criteria, { $push: { msgs: msg } })
    return msg
  } catch (err) {
    logger.error(`cannot add order msg ${orderId}`, err)
    throw err
  }
}

async function removeOrderMsg(orderId, msgId) {
  try {
    const criteria = { _id: ObjectId.createFromHexString(orderId) }
    const collection = await dbService.getCollection('order')
    await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })
    return msgId
  } catch (err) {
    logger.error(`cannot remove order msg ${orderId}`, err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      { 'guest.fullname': txtCriteria },
      { 'stay.name': txtCriteria },
    ]
  }
  if (filterBy.status) {
    criteria.status = filterBy.status
  }
  return criteria
}
