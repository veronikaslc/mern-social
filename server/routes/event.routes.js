import express from 'express'
import authCtrl from '../controllers/auth.controller'
import eventCtrl from '../controllers/event.controller'

const router = express.Router()

router.route('/api/events')
  .get(authCtrl.requireSignin, eventCtrl.list)
  .post(authCtrl.requireSignin, eventCtrl.create)
  

router.route('/api/events/byUser/:userId')
  .get(authCtrl.requireSignin, eventCtrl.listByUser)

router.route('/api/events/withGuest/:guestId')
  .get(authCtrl.requireSignin, eventCtrl.listByGuest)

router.route('/api/events/removeGuest/:eventId')
  .put(authCtrl.requireSignin, eventCtrl.removeGuest)

router.route('/api/events/:eventId')
  .get(authCtrl.requireSignin, eventCtrl.read)
  .put(authCtrl.requireSignin, eventCtrl.update)
  .delete(authCtrl.requireSignin, eventCtrl.remove)

router.param('eventId', eventCtrl.eventByID)

export default router
