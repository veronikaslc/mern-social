import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import { withStyles, Card, CardMedia, CardContent, Button, Grid, Typography } from '@material-ui/core'

import homeImg from './../assets/images/home.jpg'
import auth from './../auth/auth-helper'

import GroupIcon from '@material-ui/icons/Group'
import EventIcon from '@material-ui/icons/Event'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'

import styles from './../styles'

function Home(props) {
  const { history, classes } = props
  const [defaultPage, setDefaultPage] = useState(false)

  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

  return (
      <div className={classes.root}>
        {defaultPage &&
          <Grid
              container
              direction="column"
              justify="space-between"
              alignItems="center"
              spacing={4}
          >
            <Grid item>
              <Link to="/events/new">
                <Button color="primary" variant="contained" startIcon={<EventIcon />}>Event</Button>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/guests">
                <Button color="primary" variant="contained" startIcon={<GroupIcon />}>Guests</Button>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/events">
                <Button color="primary" variant="contained" startIcon={<AccountBalanceWalletIcon />}>Events</Button>
              </Link>
            </Grid>
          </Grid>
        }
      </div>
    )
}

export default withStyles(styles)(Home)
