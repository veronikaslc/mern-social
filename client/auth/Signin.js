import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import { useHistory } from "react-router-dom";

import { withStyles, Card, CardHeader, CardActions, CardContent, Button, TextField,
  Typography, Icon, Avatar }
  from '@material-ui/core'

import PersonIcon from '@material-ui/icons/Person'
import AlertMessage from './../core/AlertMessage'
import auth from './../auth/auth-helper'
import {signin} from './api-auth.js'
import styles from './../styles'

function Signin(props) {
  const { classes } = props
  const [ error, setError ] = useState('')
  const [values, setValues] = useState({
      email: '',
      password: '',
      redirectToReferrer: false
  })
  let history = useHistory();

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }

    signin(user).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '',redirectToReferrer: true})
        })
      }
    })
  }

  const handleChange = name => event => {
    setError("")
    setValues({ ...values, [name]: event.target.value })
  }

  const {from} = props.location.state || {
      from: {
        pathname: '/'
      }
  }

  const {redirectToReferrer} = values
    if (redirectToReferrer) {
      return (<Redirect to={from}/>)
  }

  return (
    <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6">
            <PersonIcon style={{verticalAlign: 'middle'}}/> Sign In
          </Typography>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <br/>
          <AlertMessage message={error} type="error"/>
        </CardContent>
        <CardActions className={classes.actions}>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Sign in</Button>
        </CardActions>
        <Typography variant="body1" className={classes.title}>
          Do not have an account? 
          <Link to="/signup">
            <Button variant="outlined" color="primary" className={classes.signUpButton}>Sign up</Button>
          </Link>
        </Typography>
    </Card>
  )
}

export default withStyles(styles)(Signin)
