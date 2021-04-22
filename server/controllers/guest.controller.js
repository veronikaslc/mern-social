import Guest from '../models/guest.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'

const create = async (req, res) => {
  const guest = new Guest(req.body)
  try {
    let result = await guest.save()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

/**
 * Load guest and append to req.
 */
const guestByID = async (req, res, next, id) => {
  try {
    let guest = await Guest.findById(id).populate('createdBy', '_id name')
                                        .exec()
    if (!guest)
      return res.status(400).json({
        error: "Guest not found"
      })
    req.profile = guest
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve guest"
    })
  }
}

const read = (req, res) => {
  // 1. find all events where _id is in guests
  // let count = 0
  // for each event:
  //   if !paid && event.paymentType == "cash"
  //   count = count + fee
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let guests = await Guest.find().select('_id name updated created createdBy')
                                   .populate('createdBy', '_id name')
    res.json(guests)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

const update = async (req, res) => {
    let guest = req.profile
    console.log("Guest before")
    console.log(req.body)
    guest = extend(guest, req.body)
    console.log("Guest after")
    console.log(guest)
    guest.updated = Date.now()
    try {
      await guest.save()
      res.json(guest)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getAlertMessage(err)
      })
    }
}

const remove = async (req, res) => {
  try {
    let guest = req.profile
    let deletedGuest = await guest.remove()
    res.json(deletedGuest)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

export default {
  read,
  create,
  guestByID,
  list,
  remove,
  update
}
