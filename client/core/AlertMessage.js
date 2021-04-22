import React, {useState} from 'react'

import PropTypes from 'prop-types'
import { withStyles, Alert } from '@material-ui/core'
import styles from './../styles'

// type - severity of alert - [error, warn]
function AlertMessage(props) {
  const { type, message, classes } = props

  return (
    <span>
      { message &&
        <Alert severity={type}>{message}</Alert>
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
