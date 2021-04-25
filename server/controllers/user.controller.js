import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import config from './../../config/config'

// Add ADMIN user
//
const superuser = new User({ name: 'admin', email: "email@barsuk.com", password: config.adminPass, approved: true });
superuser.save(function (err, user) {
  if (err) {
    console.log("ERROR ADDING SUPER USER")
    return console.error(err);
  }
  console.log("Addeded ADMIN superuser");
});
//

const create = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

/**
 * Load user and append to req.
 * This automatically happen each time we have :userID appended to the request
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    .exec()
    if (!user)
      return res.status(400).json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created approved')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

const update = async (req, res) => {
    let user = req.profile
    user = extend(user, req.body)
    user.updated = Date.now()
    try {
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getAlertMessage(err)
      })
    }
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getAlertMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update
}
