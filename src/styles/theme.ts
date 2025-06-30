import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  palette: {
    primary: {
      main: '#514EF3',
    },
    secondary: {
      main: '#092C4C',
    },
    background: {
      default: '#F6FAFD',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#F6FAFD',
        },
        '#root': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        main: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F6FAFD',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #EAEEF4',
          backgroundColor: '#F6FAFD',
          position: 'fixed',
          zIndex: 1201,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F6FAFD',
          marginTop: '100px',
          borderRight: '1px solid #EAEEF4',
          width: '90px',
          position: 'fixed',
          alignContent: 'center',

          '@media (max-width: 427px)': {
            width: '50px',
            padding: ' 0 10px',
            marginTop: '70px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 0,
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAEEF4',
          color: 'white',
          position: 'relative',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          boxShadow: 'none',
          fontWeight: '500',
          fontSize: '14px',
          lineHeight: '30px',
          padding: '0',
          margin: '0',
          zIndex: 1,
          minWidth: 0,
          '&:hover': {
            backgroundColor: 'none',
            boxShadow: 'none',
          },

          variants: [
            {
              props: { variant: 'contained', color: 'primary' },
              style: {
                color: '#ffffff',

                '@media (max-width:600px)': {
                  fontSize: '13px',
                },
              },
            },
            {
              props: { variant: 'contained', color: 'secondary' },
              style: {
                color: '#092C4C',

                '@media (max-width:600px)': {
                  fontSize: '13px',
                },
              },
            },
            {
              props: { variant: 'text', color: 'primary' },
              style: {
                color: 'primary',

                '&:hover': {
                  backgroundColor: 'none',
                  boxShadow: 'none',
                },

                '@media (max-width:600px)': {
                  fontSize: '13px',
                },
              },
            },
            {
              props: { variant: 'text', color: 'secondary' },
              style: {
                color: 'primary',

                '&:hover': {
                  backgroundColor: 'none',
                  boxShadow: 'none',
                },

                '@media (max-width:600px)': {
                  fontSize: '13px',
                },
              },
            },
            {
              props: { variant: 'outlined' },
              style: {
                color: '#092C4C',
                backgroundColor: '#FFFFFF',
                borderColor: '#EAEEF4',
                padding: '10px 29px',
                justifySelf: 'center',

                '&:hover': {
                  backgroundColor: 'none',
                  boxShadow: 'none',
                },

                '&.Mui-disabled': {
                  color: '#A0AEC0',
                  borderColor: '#CBD5E0',
                  backgroundColor: '#F7FAFC',
                  cursor: 'not-allowed',
                  opacity: 1,
                },

                '@media (max-width:425px)': {
                  fontSize: '13px',
                  padding: '10px 20px',
                },
              },
            },
          ],
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#F6FAFD',
          color: '#7E92A2',
          borderRadius: '8px',
          fontWeight: 400,

          '& .MuiInputLabel-root': {
            color: '#7E92A2',
            opacity: 0.9,
            fontSize: '16px',
            '@media (max-width:600px)': {
              fontSize: '13px',
            },
          },

          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F6FAFD',
            borderRadius: '4px',

            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #EAEEF4',
            },

            '& input': {
              color: '#092C4C',
              fontSize: '16px',
              '@media (max-width:600px)': {
                fontSize: '13px',
              },
              '&::placeholder': {
                color: '#7E92A2',
                opacity: 0.9,
              },
            },
          },

          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7E92A2',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& fieldset': {
            border: '1px solid #EAEEF4',

            '@media (max-width:600px)': {
              fontSize: '14px',
            },
          },
          '&.MuiPickersTextField-root': {
            background: '#F6FAFD',
            borderRadius: '4px',

            '@media (max-width:600px)': {
              fontSize: '13px',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#F6FAFD',
          color: '#7E92A2',
          padding: '15px 20px',

          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#EAEEF4',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7E92A2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7E92A2',
          },
        },
        select: {
          color: '#7E92A2',
          padding: '0px 12px 0 0 !important',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '16px',

          '@media (max-width:425px)': {
            fontSize: '14px',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '36px',
          lineHeight: '60px',
          fontWeight: 700,
          color: '#092c4c',

          '@media (max-width:600px)': {
            fontSize: '28px',
          },
        },
        h2: {
          fontSize: '28px',
          lineHeight: '40px',
          fontWeight: 700,
          color: '#092c4c',

          '@media (max-width:600px)': {
            fontSize: '22px',
          },
        },
        h3: {
          fontSize: '24px',
          lineHeight: '40px',
          fontWeight: 700,
          color: '#092c4c',

          '@media (max-width:600px)': {
            fontSize: '20px',
          },
          '@media (max-width:426px)': {
            fontSize: '18px',
          },
        },
        h4: {
          fontSize: '20px',
          lineHeight: '40px',
          fontWeight: 700,

          '@media (max-width:600px)': {
            fontSize: '18px',
          },
        },
        h5: {
          fontSize: '18px',
          lineHeight: '30px',
          fontWeight: '700',

          '@media (max-width:600px)': {
            fontSize: '16px',
          },
        },
        body1: {
          fontSize: '16px',
          lineHeight: '27px',
          fontWeight: 700,
          color: '#092C4C',

          '@media (max-width:600px)': {
            fontSize: '13px',
          },
        },
        body2: {
          fontSize: '14px',
          lineHeight: '27px',
          fontWeight: 400,
          color: '#7E92A2',

          '@media (max-width:600px)': {
            fontSize: '12px',
          },
        },
        caption: {
          fontSize: '16px',
          lineHeight: '30px',
          fontWeight: 400,
          color: '#092C4C',

          '@media (max-width:426px)': {
            fontSize: '14px',
          },

          '@media (max-width:375px)': {
            fontSize: '12px',
          },
        },
        subtitle1: {
          fontSize: '16px',
          lineHeight: '30px',
          fontWeight: 500,
          color: '#7E92A2',

          '@media (max-width:600px)': {
            fontSize: '14px',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginBottom: '12px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: '#092C4C',
          '&::placeholder': {
            color: '#7E92A2',
            opacity: 0.9,
          },
          '@media (max-width:600px)': {
            fontSize: '13px',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          input: {
            '&::placeholder': {
              color: '#7E92A2',
              opacity: 0.9,

              '@media (max-width:600px)': {
                fontSize: '13px',
              },
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #eaeef4',
          color: '#7E92A2',
          fontSize: '16px',
          lineHeight: '30px',
          fontWeight: 500,
          '@media (max-width:426px)': {
            fontSize: '14px',
            padding: '12px ',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          left: 0,
          right: 0,
          top: 0,
          padding: '0',
        },
        action: {
          marginLeft: '12px',
          padding: '0px',
          color: '#ffffff',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#2dc8a8',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          weight: ' 24px',
          height: ' 24px',
          color: '#7E92A2',

          '@media (max-width:426px)': {
            weight: ' 20px',
            height: ' 20px',
          },
        },
      },
    },
  },
});

export default theme;
