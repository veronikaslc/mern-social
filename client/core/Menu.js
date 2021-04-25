import React from 'react'
import {Link, withRouter} from 'react-router-dom'

import { AppBar, Button, Toolbar, Typography, IconButton, withStyles } from '@material-ui/core'

import FacebookIcon from '@material-ui/icons/Facebook'
import HomeIcon from '@material-ui/icons/Home'
import GroupIcon from '@material-ui/icons/Group'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import EventIcon from '@material-ui/icons/Event'
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
import EventNoteIcon from '@material-ui/icons/EventNote'
import styles from './../styles'

import auth from './../auth/auth-helper'

const facebookUrl = "https://www.facebook.com/barsuktoronto"
const facebookButton = () => {
  return ( <IconButton edge="end" style={{color: '#ffffff'}}
                       onClick={() => window.open(facebookUrl, '_blank')}>
                <FacebookIcon/>
           </IconButton>
         )
}

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#ffa726'}
  else
    return {color: '#ffffff'}
}

const Menu = withRouter( ({history, classes}) => (
<div className={classes.toolbarRoot}>
  <AppBar position="static">
    <Toolbar>
      <div className={classes.toolbarEl}>
        <Link to="/">
          <IconButton edge="start" aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
        { auth.isAuthorized() && <>
          <Link to="/events">
            <Button style={isActive(history, "/events")}
                    startIcon={<EventNoteIcon />}>
              Events
            </Button>
          </Link>
          <Link to="/guests">
            <Button style={isActive(history, "/guests")}
                    startIcon={<GroupIcon />}>
              Guests
            </Button>
          </Link>
        </>}
        { auth.isAdmin() &&
          <Link to="/users">
            <Button style={isActive(history, "/users")} startIcon={<SupervisedUserCircleIcon />}>Users</Button>
          </Link>
        }
      </div>

      <div>
      {
        !auth.isAuthenticated()
        ?
        <div>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}
                    startIcon={<AddToHomeScreenIcon />}>
              Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}
                    startIcon={<PersonIcon />}>
              Sign in
            </Button>
          </Link>
          {facebookButton()}
        </div>
        :
        <div>
          { auth.isAuthorized() &&
            <Link to="/events/new">
              <Button style={isActive(history, "/events/new")}
                      startIcon={<EventIcon />}>
                Event
              </Button>
            </Link>
          }
          <Link>
            <Button startIcon={<ExitToAppIcon />}
                    style={{color: '#ffffff!important'}}
                    onClick={() => {auth.clearJWT(() => history.push('/signin'))}}
            >
              Sign out
            </Button>
          </Link>
          {facebookButton()}
        </div>
      }
      </div>
    </Toolbar>
  </AppBar>
</div>
))

export default withStyles(styles)(Menu)
