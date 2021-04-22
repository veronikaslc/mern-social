import mongoose from 'mongoose'
const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Event name is required'
  },
  date:  {
    type: Date,
    default: Date.now
  },
  guests: [ { guest: {type: mongoose.Schema.ObjectId, ref: 'Guest'},
              paymentType: {type: String, enum : ['cash','tab','inc'], default: 'cash'},
              paid: {type: Boolean, default: false}
            }
          ],
  fee: {
    type: Number,
    default: 20
  },
  comment: {
    text: String
  },
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Event', EventSchema)
