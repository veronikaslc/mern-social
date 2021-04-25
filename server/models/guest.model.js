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
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  about: {
    type: String,
    trim: true
  },
  ballance: {type: Number, default: 0 },
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'}
})

export default mongoose.model('Guest', GuestSchema)
