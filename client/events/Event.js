import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useTheme } from '@material-ui/core/styles';

import { withStyles, Card, CardHeader, CardActions, CardContent, Button, TextField,
  Typography, Icon, Avatar, IconButton, Paper, List, ListItem, ListItemAvatar,
  ListItemSecondaryAction, Select, FormControl, InputLabel, NativeSelect, Grid,
  RadioGroup, FormControlLabel, Radio, Checkbox, Divider }
  from '@material-ui/core'

import Edit from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import CancelIcon from '@material-ui/icons/Cancel'
import DeleteDialog from './../core/DeleteDialog'
import AlertMessage from './../core/AlertMessage'
import Autocomplete from '@material-ui/lab/Autocomplete'
import auth from './../auth/auth-helper'
import Guests from './../guests/api-guest.js'
import Events from './api-event.js'
import styles from './../styles'

function Event(props) {
  const { match, classes } = props
  const [ availableGuests, setAvailableGuests ] = useState([])
  const [ guests, setGuests ] = useState([])
  const [ addedGuests, setAddedGuests ] = useState([])
  const [ error, setError ] = useState('')
  const [ values, setValues ] = useState({})
  const [ autocompleteValue, setAutocompleteValue ] = useState('');
  const [ autoValue, setAutoValue ] = useState('');
  const [ alertType, setAlertType ] = useState('error');
  const [ isEdit, setIsEdit] = useState(false)
  const jwt = auth.isAuthenticated()
  const theme = useTheme();
  const [ isNew, setIsNew ] = useState( match.params.eventId === "new")
  const saveAgent = !isNew ? Events.update : Events.create

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    Guests.list({t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        setGuests(data)
        setAvailableGuests(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [])

  // Retrieve existing event info
  useEffect(() => {
    if (isNew) {
      return
    }
    const abortController = new AbortController()
    const signal = abortController.signal
    Events.read({
      id: match.params.eventId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        setValues(data)
        setAddedGuests(data.guests)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])
  
  // Update available dropdown list each time we add/remove guest to guest list
  useEffect(() => {
    if (availableGuests.length == 0 || addedGuests.length == 0) {
      return
    }
    const ids = addedGuests.map(item => item.guest._id)
    const filteredGuests = availableGuests.filter(item => !ids.includes(item._id))
    setGuests(filteredGuests)
  }, [availableGuests, addedGuests])

  const save = () => {
    let event = values
    if (isNew) {
      event.createdBy = jwt.user._id
    }
    if (addedGuests.length > 0) {
      event.guests = []
      addedGuests.map((guest) => {event.guests.push({ guest : guest.guest._id,
                                                      paid : guest.paid,
                                                      paymentType: guest.paymentType
                                                    })
                      })
    }
    saveAgent({
      id: event._id
    }, {
      t: jwt.token
    }, event).then((data) => {
      if (data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
        setAlertType("success")
        setError("Saved event!")
        setIsNew(false)
        setValues(data)
      }
      setIsEdit(false)
    })
  }

  const createGuest = () => {
    const user = {
                   name : autocompleteValue,
                   createdBy: jwt.user._id
                 }
    Guests.create({
      t: jwt.token
    }, user).then((data) => {
      if (data.error) {
        setAlertType("error")
        setError(data.error)
      } else {
         // Add newly created guest to the guest list
         let newGuests = addedGuests.slice()
         let guest = {guest: { _id: data._id, name: data.name }, paymentType: 'cash'}
         guest.paymentType = 'cash'
         newGuests.push(guest)
         setAddedGuests(newGuests)
         // clear atocomplete field
         setAutocompleteValue("")
      }
    })
  }

  const removeGuest = (guest) => {
    // Remove guest from guest list
    let newGuests = addedGuests.slice()
    newGuests = newGuests.filter(item => item.guest._id != guest.guest._id)
    setAddedGuests(newGuests)
  }

  const addGuest = (guest) => {
    // Add selected guest to the guest list
    let newGuests = addedGuests.slice()
    let item = {guest: { _id: guest._id, name: guest.name }, paymentType: 'cash'}
    newGuests.push(item)
    setAddedGuests(newGuests)
    setAutocompleteValue("")
  }

  const handlePaymentTypeChange = (guest, paymentType) => {
    let newGuests = addedGuests.slice()
    newGuests.map(item => {if (item.guest._id == guest.guest._id) {item.paymentType = paymentType} })
    setAddedGuests(newGuests)
  }

  const handlePaidChange = (guest, paid) => {
    let newGuests = addedGuests.slice()
    newGuests.map(item => { if (item.guest._id == guest.guest._id) {item.paid = paid} })
    setAddedGuests(newGuests)
  }

  const handleChange = name => event => {
    setError("")
    const value = event.target.value
    setValues({...values, [name]: value })
  }

  return (
      <Card className={classes.cardItem}>
        { !isNew && values._id &&
            <Typography variant="body2" className={classes.detailsTop}>
              {"Created: " + (new Date(values.created)).toDateString() + " by " + values.createdBy?.name}
                <br/>
              {values.updated ? "Updated: " + (new Date(values.updated)).toDateString() : ''}
            </Typography>
        }

        <CardHeader title="Event"
                    className={classes.eventHeader}
                    action={!isNew && values._id &&
                              <>
                                { isEdit
                                  ?
                                  <IconButton color="primary" onClick={() => setIsEdit(false)}>
                                     <CancelIcon/>
                                   </IconButton>
                                  :
                                  <IconButton aria-label="Edit" color="primary" onClick={() => setIsEdit(true)}>
                                    <Edit/>
                                  </IconButton>
                                }
                                <DeleteDialog item={values}
                                              type="event"
                                              removeFunction={Events.remove}
                                              redirectBack={true}/>
                             </>}
        />
        <CardContent className={classes.cardContent}>
          <AlertMessage message={error} type={alertType}/>
          <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="center">
            <Grid item>
              <TextField id="name"
                       label="Name"
                       disabled={!isNew && !isEdit}
                       className={classes.textField}
                       value={values.name || ''}
                       onChange={handleChange('name')}
                       margin="normal"/>
            </Grid>
            <Grid item>
              <TextField id="date"
                        label="Event date"
                        type="date"
                        disabled={!isNew && !isEdit}
                        value={values.date? new Date(values.date).toISOString().split('T')[0] : ''}
                        className={classes.datePicker}
                        onChange={handleChange('date')}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"/>
              <FormControl className={classes.halfInput}>
                <InputLabel shrink htmlFor="fee-native-label-placeholder">
                  Cover
                </InputLabel>
                <NativeSelect
                  disabled={!isNew && !isEdit}
                  value={values.fee}
                  defaultValue={20}
                  onChange={handleChange('fee')}
                  inputProps={{
                    name: 'fee',
                    id: 'fee-native-label-placeholder',
                  }}
                >
                  <option value="">None</option>
                  <option value={10}>$10</option>
                  <option value={20}>$20</option>
                  <option value={30}>$30</option>
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item>
              <TextField id="comment"
                         disabled={!isNew && !isEdit}
                        label="Notes"
                        value={values.comment || ''}
                        onChange={handleChange('comment')}
                        className={classes.textField}
                        margin="normal"/>
            </Grid>
            <Grid item>
              <Autocomplete
                        value={autoValue}
                        onChange={(event, newValue) => {
                          if (event?.relatedTarget?.id == "add-button" && newInputValue == "") {
                            return
                          }
                          newValue && addGuest(newValue)
                          setAutoValue(newValue)
                        }}
                        inputValue={autocompleteValue}
                        onInputChange={(event, newInputValue) => {
                          setAutocompleteValue(newInputValue);
                        }}
                        disabled={!isNew && !isEdit}
                        value={autocompleteValue}
                        options={guests}
                        getOptionLabel={(option) => option.name || option}
                        style={{display: 'inline-flex'}}
                        className={classes.autoTextField}
                        renderInput={(params) => <TextField {...params} label="..type to add guest.." />}
                      />
              <IconButton color="primary" id="add-button" component="span" onClick={createGuest} disabled={!isNew && !isEdit}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid>
            { addedGuests.length > 0 &&
            <Grid item>
              <Typography type="title" className={classes.title}>
                Guest list
              </Typography>
              <Paper elevation={0}>
                <List>
                  { addedGuests.map((item, i) => {
                      const name = item.guest.name
                      return (
                        <ListItem key={i}>
                          <div>
                            <ListItemAvatar className={classes.avatar}>
                              <Avatar>{name.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            
                          </div>
                          <Typography style={{paddingRight: '8px'}}>
                              <Link to={"/guests/" + item.guest._id}>{name}</Link>
                            </Typography>
                          <FormControl component="fieldset">
                            <RadioGroup row aria-label="paymentType" name="paymentType" value={item.paymentType || "cash"}
                                          onChange={(event) => handlePaymentTypeChange(item, event.target.value)}>
                              <FormControlLabel labelPlacement="top" className={classes.radioLabel} value="cash" control={<Radio className={classes.radioCheck} color='primary' disabled={!(isNew || isEdit)}/>} label="cash" />
                              <FormControlLabel labelPlacement="top" className={classes.radioLabel} value="tab" control={<Radio className={classes.radioCheck} disabled={!(isNew || isEdit)}/>} label="tab" />
                              <FormControlLabel labelPlacement="top" className={classes.radioLabel} value="inc" control={<Radio className={classes.radioCheck} disabled={!(isNew || isEdit)}/>} label="inc" />
                            </RadioGroup>
                          </FormControl>
                          <FormControlLabel
                            control={
                              <Checkbox
                                className={classes.radioCheck}
                                disabled={!(isNew || isEdit)}
                                style={{color: theme.palette.info['400']}}
                                checked={item.paid}
                                onChange={(event) => handlePaidChange(item, event.target.checked)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                              />
                            }
                            labelPlacement="top"
                            label="paid"
                          />
                          <ListItemSecondaryAction className={classes.follow}>
                            <IconButton aria-label="Delete" onClick={() => removeGuest(item)} disabled={!(isNew || isEdit)}>
                              <CloseIcon/>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    })
                  }
                </List>
              </Paper>
            </Grid>
          }
          </Grid>
        </CardContent>
        <CardActions>
          <Button color="primary"
                  variant="contained"
                  disabled={!(isNew || isEdit)}
                  onClick={save}
                  className={classes.submit}
          >
            Save
          </Button>
        </CardActions>
      </Card>
  )
}

export default withStyles(styles)(Event)
