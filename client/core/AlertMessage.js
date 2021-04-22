import React, {useState} from 'react'

import PropTypes from 'prop-types'
import { withStyles, IconButton, Typography } from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import WarningIcon from '@material-ui/icons/Warning'
import InfoIcon from '@material-ui/icons/Info'
import styles from './../styles'

const defaultIconMapping = {
  success: { icon : <CheckCircleOutlineIcon size="small" fontSize="inherit" />, color: 'primary'},
  warning: { icon : <WarningIcon size="small" fontSize="inherit" />, color: 'secondary'},
  error: { icon : <ErrorOutlineIcon size="small" fontSize="inherit" />, color: 'error'},
  info: { icon : <InfoIcon size="small" fontSize="inherit" />, color: 'default'}
};

// type - severity of alert - [error, warn]
function AlertMessage(props) {
  const { type, message, classes } = props

  return (
    <span>
      { message &&
        <Typography color={defaultIconMapping[type].color}>
          <IconButton color={defaultIconMapping[type].color} component="span">
            { defaultIconMapping[type].icon }
          </IconButton>
          {message}
        </Typography>
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
