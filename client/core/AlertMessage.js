import React, { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { withStyles, Fade } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import styles from './../styles'

// type - severity of alert - ['error', 'info', 'success', 'warning']
function AlertMessage(props) {
  const { type, message, classes } = props
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
     if(!message){
      setIsVisible(false)
      return
     }
     // Display the message and hide after 5 secs
     setIsVisible(true)
     const timer = setTimeout(() => {
       setIsVisible(false)
     }, 5000);
     return () => clearTimeout(timer);
   }, [message])

  if (!isVisible) return null

  return (
    <span>
      { message &&
        <Fade in={isVisible}>
          <Alert severity={type}>{message}</Alert>
        </Fade>
      }
    </span>
  )
}

AlertMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'info', 'success', 'warning'])
}

AlertMessage.defaultProps = {
  type: 'info'
}

export default withStyles(styles)(AlertMessage)
