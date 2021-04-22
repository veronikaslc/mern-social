import Event from '../models/event.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
    const event = new Event(req.body)
    try {
      let result = await event.save()
      res.json(result)
    } catch (err){
      return res.status(400).json({
        error: errorHandler.getAlertMessage(err)
      })
    }
}

const eventByID = async (req, res, next, id) => {
  try {
    let event = await Event.findById(id)
                           .populate('createdBy', '_id name')
                           .populate('guests.guest', '_id name')
                           .exec()
                
    if (!event)
      return res.status(400).json({
        error: "Event not found"
    })
    req.event = event
    next()
  }catch(err){
    return res.status(400).json({
      error: "Could not retrieve event"
    })
  }
}

const read = (req, res) => {
  return res.json(req.event)
}

const list = async (req, res) => {
  try {
    let events = await Event.find().select('name date fee createdBy guests')
                                   .populate('createdBy', '_id name')
                                   .sort('-date')
                                   .lean()
    let reduced = events.map( item => {
      item.guests = item.guests.length
      item.creator = item.createdBy.name
      return item
    })
    res.json(reduced)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

const listByUser = async (req, res) => {
  try {
    let events = await Event.find({createdBy: req.params.userId})
                            .select('name date fee guests')
                            .sort('-created')
                            .lean()
                            .exec()

    let reduced = events.map( item => {
      item.guests = item.guests.length
      return item
    })
    res.json(reduced)
  } catch(err){
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

const listByGuest = async (req, res) => {
  try {
    let events = await Event.find({'guests.guest': req.params.guestId})
                            .select('name date fee createdBy guests')
                            .populate('createdBy', '_id name')
                            .sort('-created')
                            .lean()
                            .exec()

    let reduced = events.map( item => {
      item.guests = item.guests.length
      item.creator = item.createdBy.name
      return item
    })
    res.json(reduced)
  } catch(err){
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

const update = async (req, res) => {
    let event = req.event
    try {
      event = extend(event, req.body)
      event.updated = Date.now()
      await event.save()
      res.json(event)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getAlertMessage(err)
      })
    }
}

const removeGuest = async (req, res) => {
    let event = req.event
    console.log("Before")
    console.log(req.body.guestId)
    console.log(event.guests)
    let guests = event.guests.filter( guest => guest.guest._id != req.body.guestId )
    console.log("After")
    console.log(guests)
    event.guests = guests
    event.updated = Date.now()
    try {
      await event.save()
      res.json(event)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getAlertMessage(err)
      })
    }
}

const remove = async (req, res) => {
  let event = req.event
  try {
    let deletedEvent = await event.remove()
    res.json(deletedEvent)
  } catch(err){
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

export default {
  read,
  list,
  listByUser,
  listByGuest,
  create,
  eventByID,
  update,
  remove,
  removeGuest
}
