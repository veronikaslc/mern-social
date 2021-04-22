import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'

import { withStyles, Avatar, Divider, IconButton, Paper, List, ListItem,
  Typography, TextField, Grid, CardContent, Card, CardHeader }
  from '@material-ui/core'
  
import Edit from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Cancel'
import PersonIcon from '@material-ui/icons/Person'
import DeleteDialog from './../core/DeleteDialog'
import AlertMessage from './../core/AlertMessage'
import auth from './../auth/auth-helper'
import Users from './api-user.js'
import EventsApi from './../events/api-event.js'
import styles from './../styles'
import Events from './../events/Events'

function User(props) {
  const { match, classes } = props
  const [user, setUser] = useState({})
  const [error, setError] = useState('')
  const [events, setEvents] = useState([])
  const [alertType, setAlertType] = useState('error');
  const [edit, setEdit] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    if (!match.params.userId) {
      return
    }
    const abortController = new AbortController()
    const signal = abortController.signal
    Users.read({
      id: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        setUser(data)
        loadEvents(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.userId])

  const loadEvents = (user) => {
    EventsApi.listByUser({
      id: user._id
    }, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        setEvents(data)
      }
    })
  }

  const save = () => {
    Users.update({
      id: user._id
    }, {
      t: jwt.token
    }, user).then((data) => {
      if (data && data.error) {
        setAlertType("error")
        setError(error)
      } else {
        setAlertType("success")
        setError("Saved user!")
        setUser(data)
      }
      setEdit(false)
    })
  }

  const handleChange = name => event => {
    setError('')
    const value = event.target.value
    setUser({...user, [name]: value })
  }

  return (
      <Card className={classes.cardItem}>
        <Typography variant="body2" className={classes.detailsTop}>
          {"Created: " + (new Date(user.created)).toDateString()}
            <br/>
          {user.about ? "About: " + user.about : ''}
        </Typography>

        <CardHeader title={<><PersonIcon style={{verticalAlign: 'middle'}}/> User Profile</>}
                    className={classes.eventHeader}
                    action={ match.params.userId && <> 
                             { !edit 
                               ? 
                                 <IconButton color="primary" onClick={() => setEdit(true)}>
                                   <Edit/>
                                 </IconButton>
                               :
                                 <>
                                   <IconButton color="primary" onClick={save}>
                                     <DoneIcon/>
                                   </IconButton>
                                   <IconButton color="primary" onClick={() => setEdit(false)}>
                                     <CancelIcon/>
                                   </IconButton>
                                 </>
                              }
                              { !auth.isAdmin() &&
                                  <DeleteDialog item={user}
	                                            type="user"
	                                            removeFunction={Users.remove}
	                                            redirectBack={true}/>
                              }
                            </>}
        />
        <CardContent className={classes.cardContent}>
            <AlertMessage message={error} type={alertType}/>
            <List dense>
              <ListItem>
                <Grid
                  container
                  direction="column"
                  justify="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                      <TextField id="name"
                         disabled={!edit}
                         label="Name"
                         className={classes.textField} 
                         value={user.name || ''} 
                         onChange={handleChange('name')}
                         margin="normal"/>
                  </Grid>
                  <Grid item>
                      <TextField id="email"
                         type="email"
                         disabled={!edit}
                         label="Email"
                         className={classes.textField}
                         value={user.email || ''}
                         onChange={handleChange('email')}
                         margin="normal"/>
                  </Grid>
                  <Grid item>
                    <TextField id="password"
                         type="password"
                         disabled={!edit}
                         label="Password"
                         className={classes.textField}
                         value={user.password || ''}
                         onChange={handleChange('password')}
                         margin="normal"/>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider/>
              { events.length > 0 &&
                <ListItem>
                  <Events data={events}
                          principal={"user"}
                          style={{width: '100%'}}
                          tableTitle={"Events created by " + user.name}/>
                </ListItem>
              }
            </List>
        </CardContent>
      </Card>
  )
}

export default withStyles(styles)(User)
