import { createMuiTheme } from '@material-ui/core/styles'
import { teal, orange } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#52c7b8',
      main: '#009688',
      dark: '#00675b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffd95b',
      main: '#ffa726',
      dark: '#c77800',
      contrastText: '#000',
    },
      openTitle: teal['700'],
      protectedTitle: orange['700'],
      type: 'light'
    }
  })

theme.overrides = {
  ...theme.overrides,
  MuiButton: {
      ...theme.MuiButton,
      root: {
         fontSize: '0.6rem'
      },
      iconSizeMedium: {
        '& > *:first-child': {
          fontSize: '0.7rem'
        },
      },
      startIcon: {
        ...theme.startIcon,
        marginRight: theme.spacing(0.5)
      }
  },
  MuiIconButton: {
      ...theme.MuiIconButton,
      root: {
         fontSize: '0.6rem',
         padding: theme.spacing(1)
      },
  },
  MuiSvgIcon: {
      ...theme.MuiSvgIcon,
      root: {
         fontSize: '1.2rem!important',
      },
  },
  MuiIcon: {
    root: {
       fontSize: '1.2rem!important',
    },
  },
  MuiToolbar: {
    dense: {
      minHeight: theme.spacing(3)
    },
    gutters: {
      padding: "0 8px!important"
    },
  },
  MuiTypography: {
    body1:{
      fontSize: '0.7rem',
    }
  },
  MuiTableRow: {
    root: {
      padding : theme.spacing(1),
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`
    },
    footer: {
      padding : '0'
    }
  },
  MuiTablePagination: {
    toolbar: {
      minHeight: theme.spacing(3)
    },
  },
  MuiTableCell: {
    ...theme.MuiTableCell,
    root: {
      ...theme.root,
      padding: '0',
      fontSize: `0.7rem!important`,
      padding: theme.spacing(0.5)
    },
    head: {
      ...theme.head,
      backgroundColor: theme.palette.grey['200'],
    }
  },
  
  
     
}

  export default theme  