import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'
import Signup from './users/Signup'
import Signin from './auth/Signin'
import Home from './core/Home'
import Users from './users/Users'
import User from './users/User'
import Events from './events/Events'
import Event from './events/Event'
import Guests from './guests/Guests'
import Guest from './guests/Guest'

const MainRouter = () => {
  return (
    <div>
      <Menu/>
      <Switch>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/signin" component={Signin}/>
        <Route exact path="/" component={Home}/>
        <PrivateRoute exact path="/users" component={Users}/>
        <PrivateRoute exact path="/users/:userId" component={User}/>
        <PrivateRoute exact path="/events" component={Events}/>
        <PrivateRoute exact path="/events/:eventId" component={Event}/>
        <PrivateRoute exact path="/events/new" component={Event}/>
        <PrivateRoute exact path="/guests" component={Guests}/>
        <PrivateRoute exact path="/guests/:guestId" component={Guest}/>
      </Switch>
    </div>
  )
}

export default MainRouter
