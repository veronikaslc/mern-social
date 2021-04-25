const styles = theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    margin: theme.spacing(2)
  }),
  card: {
    maxWidth: 400,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  cardItem: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '& .MuiListItem-gutters': {
      padding: '0'
    }
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle
  },
  textField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  halfInput: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 140,
  },
  autoTextField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 240, 
  },
  datePicker: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 140,
    cursor: 'pointer',
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  actions: {
    display: 'initial'
  },
  signUpButton: {
    marginLeft: theme.spacing(1),
  },
  cardContent: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0
  },
  cardHeader: {
    paddingTop: 8,
    paddingBottom: 8
  },
  title: {
    margin: theme.spacing(1),
    color: theme.palette.protectedTitle
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto'
  },
  radioLabel: {
    margin: '0'
  },
  radioCheck: {
    paddingTop: '0'
  },
  toolbar: {
    justifyContent: 'space-between'
  },
  toolbarRoot: {
    flexGrow: 1,
  },
  toolbarEl: {
    flexGrow: 1,
  },
  detailsTop: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    opacity: '.8'
  },
  deleteButton: {
    padding: '0',
  },
  eventHeader: {
    paddingLeft: theme.spacing(6),
  },
  cover: {
    width: '150px'
  }
})

export default styles
