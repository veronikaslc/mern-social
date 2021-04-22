import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })

    if (!user)
      return res.status(401).json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: "Email and password don't match."
      })
    }

    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.json({
      token,
      user: {_id: user._id, name: user.name, email: user.email, approved : user.approved}
    })
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      error: "Could not sign in"
    })
  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status(200).json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth'
})

const hasAuthorization = async (req, res, next) => {
  if (!req.auth || !req.auth._id) {
    return res.status(403).json({
      error: "Not authorised"
    })
  }

  let user = await User.findById(req.auth._id)
  if (!user)
    return res.status(401).json({
      error: "User not found"
  })

  if (!user.approved ) {
    return res.status(403).json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}
