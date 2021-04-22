import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'

import { withStyles, List, ListItem, ListItemText, IconButton, Divider, TextField, Grid,
  CardContent, Card, CardHeader, Typography } from '@material-ui/core'
  
import Edit from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Cancel'
import PersonIcon from '@material-ui/icons/Person'
import DeleteDialog from './../core/DeleteDialog'
import AlertMessage from './../core/AlertMessage'
import auth from './../auth/auth-helper'
import GuestsApi from './api-guest.js'
import EventsApi from './../events/api-event.js'
import styles from './../styles'
import Events from './../events/Events'

function Guest(props) {
  const { match, classes } = props
  const [guest, setGuest] = useState({})
  const [error, setError] = useState('')
  const [events, setEvents] = useState([])
  const [alertType, setAlertType] = useState('error');
  const [edit, setEdit] = useState(false)
  const jwt = auth.isAuthenticated()
  const isNew = match.params.guestId === "new"
  const saveAgent = !isNew ? GuestsApi.update : GuestsApi.create

  useEffect(() => {
    if (!match.params.guestId) {
      return
    }
    const abortController = new AbortController()
    const signal = abortController.signal
    GuestsApi.read({
      id: match.params.guestId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        setGuest(data)
        loadEvents(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.guestId])

  const loadEvents = (guest) => {
    EventsApi.listByGuest({
      id: guest._id
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

  const removeGuestFromEvent = (eventId) => {
    EventsApi.removeGuest({
      id: eventId
    }, {
      t: jwt.token
    }, {guestId : guest._id}).then((data) => {
      if (data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        // remove from table
        const updatedEvents = events
        const index = updatedEvents.indexOf(event)
        updatedEvents.splice(index, 1)
        setEvents(updatedEvents)
      }
    })
  }

  const save = () => {
    if (isNew) {
      guest.createdBy = jwt.user._id
    }
    saveAgent({
      id: guest._id
    }, {
      t: jwt.token
    }, guest).then((data) => {
      if (data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        setAlertType("success")
        setError("Saved guest!")
        setGuest(data)
      }
      setEdit(false)
    })
  }

  const handleChange = name => event => {
    setError('')
    const value = event.target.value
    setGuest({...guest, [name]: value })
  }

  return (
      <Card className={classes.cardItem}>
        { !isNew && guest._id &&
            <Typography variant="body2" className={classes.detailsTop}>
              {"Created: " + (new Date(guest.created)).toDateString() + " by " + guest.createdBy?.name}
                <br/>
              {guest.updated ? "Updated: " + (new Date(guest.updated)).toDateString() : ''}
            </Typography>
        }

        <CardHeader title={<><PersonIcon style={{verticalAlign: 'middle'}}/>Guest Profile</>}
                    className={classes.eventHeader}
                    action={ !isNew && guest._id &&<> 
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
                              <DeleteDialog itemId={match.params.guestId}
                                type="guest"
                                name={guest.name}
                                removeFunction={GuestsApi.remove}
                                redirectBack={true}/>
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
                         value={guest.name || ''} 
                         onChange={handleChange('name')}
                         margin="normal"/>
                  </Grid>
                  <Grid item>
                      <TextField id="about"
                         disabled={!edit}
                         label="About"
                         className={classes.textField}
                         value={guest.about || ''}
                         onChange={handleChange('about')}
                         margin="normal"/>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider/>
              { events.length > 0 &&
                <ListItem>
                  <Events data={events}
                          principal={"guest"}
                          tableTitle={"Events attenden by " + guest.name}
                          removeMessage={"Confirm to delete " + guest.name + " "}
                          removeCustomAction={removeGuestFromEvent}/>
                </ListItem>
              }
            </List>
        </CardContent>
      </Card>
  )
}

export default withStyles(styles)(Guest)
