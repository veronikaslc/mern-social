import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useTheme } from '@material-ui/core/styles';

import { withStyles, Avatar, Badge, Paper, Switch, Typography } from '@material-ui/core'

import DeleteDialog from './../core/DeleteDialog'
import AlertMessage from './../core/AlertMessage'
import UsersApi from './api-user.js'
import auth from './../auth/auth-helper'
import styles from './../styles'
import MaterialTable from 'material-table'

function Users(props) { 
  const { classes } = props;
  const [ users, setUsers ] = useState([])
  const [ error, setError ] = useState('')
  const [ rowCount, setRowCount ] = useState(5)
  const jwt = auth.isAuthenticated()
  const theme = useTheme();

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    UsersApi.list({t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setError(data.error)
      } else {
        setUsers(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const handleApprove = (user, isApproved) => {
    setError('')
    let data = user
    data.approved = isApproved
    UsersApi.update({
      id: user._id
    }, {
      t: jwt.token
    }, data).then((data) => {
      if (data && data.error) {
        setError(data.error)
      } else {
        setUsers( users.map( item => { if (item._id == user._id) {
                                         user.approved = isApproved
                                       }
                                       return item
                                     }))
      }
    })
  }

  const StyledBadge = withStyles((theme) => ({
      badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          animation: '$ripple 1.2s infinite ease-in-out',
          border: '1px solid currentColor',
          content: '""',
        },
      },
      '@keyframes ripple': {
        '0%': {
          transform: 'scale(.8)',
          opacity: 1,
        },
        '100%': {
          transform: 'scale(2.4)',
          opacity: 0,
        },
      },
  }))(Badge);

  return (
      <Paper className={classes.root} elevation={0}>
        <AlertMessage message={error} type="error"/>
        <MaterialTable
            title={<Typography>Users</Typography>}
            columns={[
              { title: 'Name',
                field: 'name',
                cellStyle: {width: '30%'},
                render: rowData => <>
                                     { rowData.approved
                                        ? 
                                        <Avatar className={classes.iconSmall}
                                                style={{display: 'inline-flex'}}>
                                          {rowData.name.charAt(0)}
                                        </Avatar>
                                        :
                                        <StyledBadge
                                            overlap="circle"
                                            anchorOrigin={{
                                              vertical: 'bottom',
                                              horizontal: 'right',
                                            }}
                                            variant="dot"
                                          >
                                            <Avatar className={classes.iconSmall}>
                                              {rowData.name.charAt(0)}
                                            </Avatar>
                                          </StyledBadge>
                                       }
                                       <Link to={"/users/" + rowData._id}
                                             style={{marginLeft: theme.spacing(1)}}
                                       >
                                         {rowData.name}
                                       </Link>
                                     </>
              },
              { title: 'Created',
                cellStyle: {width: '20%'},
                render: rowData => (new Date(rowData.created)).toDateString()
              },
              { title: 'Email',
                field: 'email'
              },
              { title: '',
                cellStyle: {textAlign: 'right'},
                headerStyle: { textAlign: 'right', padding: theme.spacing(1) },
                sorting: false,
                render: rowData => <>
                                     <Switch
                                        size="small"
                                        checked={rowData.approved}
                                        onChange={(event) => handleApprove(rowData, event.target.checked)}
                                        color="primary"
                                        name="checkedB"
                                        disabled={rowData.name== "admin"}
                                        inputProps={{ 'aria-label': 'primary checkbox' }}/>
                                      <DeleteDialog item={rowData}
                                                    type="user"
                                                    disabled={rowData.name== "admin"}
                                                    removeFunction={UsersApi.remove}/>
                                   </>
              },
            ]}
            data={users}
            options={{
              search: true,
              exportButton: true,
              emptyRowsWhenPaging: false,
              actionsColumnIndex: -1,
              addRowPosition: 'first',
              pageSize: rowCount,
              headerStyle: { backgroundColor: theme.palette.grey['200'],},
              searchFieldStyle: {fontSize: '0.7rem',},
            }}
            onChangeRowsPerPage={pageSize => {
              setRowCount(pageSize);
            }}
          />
      </Paper>
    )
}

export default withStyles(styles)(Users)
