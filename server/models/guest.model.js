import mongoose from 'mongoose'
import crypto from 'crypto'
const GuestSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  about: {
    type: String,
    trim: true
  },
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

export default mongoose.model('Guest', GuestSchema)
