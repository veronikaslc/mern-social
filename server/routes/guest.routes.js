import express from 'express'
import guestCtrl from '../controllers/guest.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/guests')
  .get(authCtrl.requireSignin, guestCtrl.list)
  .post(authCtrl.requireSignin, guestCtrl.create)

router.route('/api/guests/:guestId')
  .get(authCtrl.requireSignin, guestCtrl.read)
  .put(authCtrl.requireSignin, guestCtrl.update)
  .delete(authCtrl.requireSignin, guestCtrl.remove)

router.param('guestId', guestCtrl.guestByID)

export default router
