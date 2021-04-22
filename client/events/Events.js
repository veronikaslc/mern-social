import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useTheme } from '@material-ui/core/styles';

import { withStyles, Paper, Typography } from '@material-ui/core'

import ArrowForward from '@material-ui/icons/ArrowForward'
import DeleteDialog from './../core/DeleteDialog'
import AlertMessage from './../core/AlertMessage'
import Person from '@material-ui/icons/Person'
import EventsApi from './api-event.js'
import auth from './../auth/auth-helper'
import Event from './Event'
import MaterialTable from 'material-table'
import styles from './../styles'

function Events(props) { 
  const { data, principal, tableTitle, removeCustomAction, removeEventCallback, removeMessage, classes } = props
  const [ rowCount, setRowCount ] = useState(5)
  const [ events, setEvents ] = useState(data || [])
  const [ error, setError ] = useState('')
  const jwt = auth.isAuthenticated()
  const theme = useTheme();
  
  let columns = [
      { title: 'Name',
        field: 'name',
        cellStyle: { padding: theme.spacing(2),},
        headerStyle: { padding: theme.spacing(2),},
        render: rowData => <Link to={"/events/" + rowData._id}>
                             {rowData.name}
                           </Link>
      },
      { title: 'Date',
        field: 'date',
        cellStyle: { padding: theme.spacing(1), width: '25%'},
        render: rowData => (new Date(rowData.date)).toDateString()
      },
      { title: 'Creator',
        field: 'creator',
        cellStyle: { padding: theme.spacing(1),},
        render: rowData => <Link to={"/users/" + rowData._id}>
                             {rowData.creator}
                           </Link>
      },
      { title: 'Cover',
        field: 'fee',
        cellStyle: { padding: '0',},
        headerStyle: { padding: '0',},
        render: rowData => <Typography>${rowData.fee}</Typography>
      },
      { title: 'Guests',
        cellStyle: { padding: '0',},
        headerStyle: { padding: '0',},
        field: 'guests'
      },
      { title: 'Actions',
        cellStyle: { padding: theme.spacing(2), textAlign: 'right'},
        headerStyle: { textAlign: 'right', padding: theme.spacing(2) },
        sorting: false,
        render: rowData => <DeleteDialog itemId={rowData._id}
                                         item={rowData}
                                          type="event"
                                          name={rowData.name}
                                          removeFunction={EventsApi.remove}
                                          removeMessage={removeMessage}
                                          removeCustomAction={removeCustomAction}
                                          callback={removeEventCallback || onEventDelete}
                           />
      },
    ]
  // if we show events created by user we hide Creator column
  if (principal && principal == "user") {
    columns.splice(2, 1)
  }

  const onEventDelete = (event) => {
    const updatedEvent = events
    const index = updatedEvents.indexOf(event)
    updatedEvents.splice(index, 1)
    setEvents(updatedEvents)
  }

  useEffect(() => {
    if (data) return

    const abortController = new AbortController()
    const signal = abortController.signal

    EventsApi.list({t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setError(data.error)
      } else {
        setEvents(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
      <Paper className={!principal ? classes.root : ''} elevation={0}>
        {tableTitle && <Typography variant="h6" className={classes.title}>
          {tableTitle}
        </Typography>}
        <AlertMessage message={error} type="error"/>
        <MaterialTable
            title={!tableTitle ? "All Events" : ""}
            columns={columns}
            data={events}
            options={{
              search: true,
              exportButton: true,
              emptyRowsWhenPaging: false,
              actionsColumnIndex: -1,
              addRowPosition: 'first',
              pageSize: rowCount,
              headerStyle: { backgroundColor: theme.palette.grey['200'],
                             padding: `16px 8px`,
                             fontSize: `13pt` },
              rowStyle: { padding : theme.spacing(1),
                          fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`
                         }
            }}
            onChangeRowsPerPage={pageSize => {
              setRowCount(pageSize);
            }}
          />
      </Paper>
    )
}

export default withStyles(styles)(Events)
