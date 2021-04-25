import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useTheme } from '@material-ui/core/styles';

import { withStyles, Paper, Typography } from '@material-ui/core'

import DeleteDialog from './../core/DeleteDialog'
import AlertMessage from './../core/AlertMessage'
import GuestsApi from './api-guest.js'
import auth from './../auth/auth-helper'
import MaterialTable from "material-table"
import styles from './../styles'

function Guests(props) { 
  const { classes } = props
  const [ error, setError ] = useState('')
  const [ rowCount, setRowCount ] = useState(5)
  const [ guests, setGuests ] = useState([])
  const theme = useTheme();
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    GuestsApi.list({t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setError(data.error)
      } else {
        setGuests(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <Paper className={classes.root} elevation={0}>
      <AlertMessage message={error} type="error"/>
        <MaterialTable
          title={<Typography>Guests</Typography>}
          columns={[
            { title: 'Name',
              field: 'name',
              cellStyle: {padding: theme.spacing(2), width: '20%'},
              headerStyle: { padding: theme.spacing(2),},
              render: rowData => <Link to={"/guests/" + rowData._id}>{rowData.name}</Link>
            },
            { title: 'Date created',
              field: 'created',
              cellStyle: { padding: theme.spacing(1), width: '20%'},
              render: rowData => (new Date(rowData.created)).toDateString()
            },
            { title: 'balance',
              field: 'balance'
            },
            { title: 'Actions',
              cellStyle: { padding: theme.spacing(2), textAlign: 'right'},
              headerStyle: { textAlign: 'right', padding: theme.spacing(2) },
              sorting: false,
              render: rowData => <DeleteDialog item={rowData}
                                               type="guest"
                                               removeFunction={GuestsApi.remove}/>
              },
            ]}
            data={guests}
            options={{
              search: true,
              exportButton: true,
              emptyRowsWhenPaging: false,
              actionsColumnIndex: -1,
              addRowPosition: 'first',
              pageSize: rowCount,
              headerStyle: { backgroundColor: theme.palette.grey['200'] },
              searchFieldStyle: {fontSize: '0.7rem',},
            }}
            onChangeRowsPerPage={pageSize => {
              setRowCount(pageSize);
            }}
          />
      </Paper>
    )
}

export default withStyles(styles)(Guests)