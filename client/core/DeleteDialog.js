import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'

import { withStyles, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Tooltip } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import AlertMessage from './AlertMessage'
import auth from './../auth/auth-helper'
import styles from './../styles'

function DeleteDialog(props) {
  const { item, type, removeMessage, removeCustomAction, removeFunction, redirectBack, onDelete, classes } = props
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const jwt = auth.isAuthenticated()
  const history = useHistory();
  const clickButton = () => {
    setOpen(true)
  }
  const name = item.name

  const deleteItem = () => {
    if (removeCustomAction) {
      // For example, if we pass whole custom action like remove guest from event
      removeCustomAction(item, onDelete)
      setOpen(false)
    } else {
      removeFunction({
        id: item._id
      }, {t: jwt.token}).then((data) => {
        if (data && data.error) {
          setError(data.error)
        } else {
          if (redirectBack) {
            goBack()
          } else {
            onDelete && onDelete(item)
            setOpen(false)
          }
        }
      })
    }
  }
  
  let goBack = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace("/");
    }
  }

  const handleRequestClose = () => {
    setError("")
    setOpen(false)
  }

  return (
    <span>
      <Tooltip title={(removeMessage || "delete ") + type + " " + name}>
        <IconButton aria-label="Delete" onClick={clickButton} color="secondary" className={classes.deleteButton}>
          <DeleteIcon/>
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to {(removeMessage || "delete ") + type + " " + name}
          </DialogContentText>
          <AlertMessage message={error} type="error"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteItem} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}

DeleteDialog.propTypes = {
  item: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  removeFunction: PropTypes.func.isRequired,
}
DeleteDialog.defaultProps = {
  name: '',
  redirectBack: false
}

export default withStyles(styles)(DeleteDialog)
