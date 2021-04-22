import React, {useState} from 'react'
import {Link} from 'react-router-dom'

import { withStyles, Card, CardActions, CardContent, Button, TextField, Typography, Icon,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle }
  from '@material-ui/core'
 
import Users from './api-user.js'
import AlertMessage from './../core/AlertMessage'
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen'

import styles from './../styles'

function Signup(props){
  const { classes } = props
  const [ error, setError ] = useState('')
  const [values, setValues] = useState({
    name: '',
    password: '',
    email: '',
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    setError('')
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    Users.create(user).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setValues({ ...values, open: true})
      }
    })
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">
            <AddToHomeScreenIcon style={{verticalAlign: 'middle'}}/> Sign Up
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/>
          <AlertMessage message={error} type="error"/>
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
        <Typography variant="body1" className={classes.title}>
          Already have an account? 
          <Link to="/signin">
            <Button variant="outlined" color="primary" className={classes.signUpButton}>Sign in</Button>
          </Link>
        </Typography>
      </Card>
      <Dialog open={values.open} disableBackdropClick={true}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus="autoFocus" variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default withStyles(styles)(Signup)
