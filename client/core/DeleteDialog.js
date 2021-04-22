import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'

import { withStyles, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle } from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'
import AlertMessage from './AlertMessage'
import auth from './../auth/auth-helper'
import styles from './../styles'

function DeleteDialog(props) {
  const { itemId, type, name, removeMessage, removeCustomAction, removeFunction, redirectBack,
    callback, classes } = props
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const jwt = auth.isAuthenticated()
  const history = useHistory();
  const clickButton = () => {
    setOpen(true)
  }

  const deleteItem = () => {
    if (removeCustomAction) {
      // if we pass whole action like remove guest from event
      removeCustomAction(itemId)
      setOpen(false)
    }
    removeFunction({
      id: itemId
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        setError(data.error)
      } else {
        if (redirectBac) {
          goBack()
        } else {
          callback && callback(item) 
          setOpen(false)
        }
      }
    })
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

  return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary" className={classes.deleteButton}>
        <DeleteIcon/>
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>Delete {type}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {(removeMessage || "Confirm to delete ") + type + " " + name}
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
    </span>)
}

DeleteDialog.propTypes = {
  itemId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  removeFunction: PropTypes.func.isRequired,
}
DeleteDialog.defaultProps = {
  name: '',
  redirectBack: false
}

export default withStyles(styles)(DeleteDialog)
