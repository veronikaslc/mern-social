import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import { withStyles, Card, CardMedia, CardContent, Button, Grid, Typography } from '@material-ui/core'

import homeImg from './../assets/images/homeq.jpg'
import GroupIcon from '@material-ui/icons/Group'
import EventIcon from '@material-ui/icons/Event'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import { Alert } from '@material-ui/lab'

import auth from './../auth/auth-helper'

import styles from './../styles'

function Home(props) {
  const { history, classes } = props
  const [defaultPage, setDefaultPage] = useState(false)

  if (auth.isAuthenticated() && !auth.isAuthorized()) {
    return (<div className={classes.root}>
             <Alert severity="warning">Account is waiting for the approval</Alert>
           </div>)
  }

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
      <Card style={{display: 'flex'}}>
	      <CardMedia
	        style={{width: 151}}
	        image={homeImg}
	        title="Live from space album cover"
	      />
	      <div style={{display: 'flex', flexDirection: 'column'}}>
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

        </Card>
      </div>
    )
}

export default withStyles(styles)(Home)
