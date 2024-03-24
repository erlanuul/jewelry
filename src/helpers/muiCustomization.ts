import { createTheme, outlinedInputClasses } from "@mui/material";

declare module '@mui/material/styles' {
    interface Palette {
        blue: Palette['primary'];
    }

    interface PaletteOptions {
        blue?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        blue: true;
    }
}

export const theme = createTheme({
    palette: {
        blue: {
            main: '#576ED0',
            light: 'rgba(87,110,208,0.88)',
            dark: '#5069ce',
            contrastText: '#FFF',
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 100,
                    height: 47
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '--TextField-brandBorderColor': '#CED0D2',
                    '--TextField-brandBorderHoverColor': '#6E6C6A',
                    '--TextField-brandBorderFocusedColor': '#6E6C6A',
                    '--TextField-inputBackground': '#F6F6F6',
                    marginTop: 30,
                    '& input': {
                        padding: '12px 20px',
                    },
                    '& label.Mui-focused': {
                        color: 'var(--TextField-brandBorderFocusedColor)',
                    },
                    '& fieldset legend': {
                        display: 'none',
                    },
                    '& fieldset': {
                        borderRadius: 100,
                        borderColor: 'var(--TextField-brandBorderColor)',
                        top: 0,
                    },
                },
            },
            defaultProps: {
                InputLabelProps: {
                    shrink: true,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: 100,
                    background: '#F6F6F6',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: 'var(--TextField-brandBorderColor)',
                    top: 0,
                },
                root: {
                    borderRadius: 100,
                    [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: 'var(--TextField-brandBorderHoverColor)',
                    },
                    [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: 'var(--TextField-brandBorderFocusedColor)',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    position: 'absolute',
                    top: -20,
                    left: 0,
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    color: '#6E6C6A',
                },
            },
        },
        MuiSelect: { // Customizations for Select
            styleOverrides: {
                select: {
                    padding: '12px 20px',
                    borderRadius: 100,
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '--TextField-brandBorderColor': '#CED0D2',
                    '--TextField-brandBorderHoverColor': '#6E6C6A',
                    '--TextField-brandBorderFocusedColor': '#6E6C6A',
                    '& label.Mui-focused': {
                        color: 'var(--TextField-brandBorderFocusedColor)',
                    },
                    '& fieldset legend': {
                        display: 'none',
                    },
                    '& fieldset': {
                        borderRadius: 100,
                        borderColor: 'var(--TextField-brandBorderColor)',
                        top: 0,
                    },
                    justifyContent: 'end',
                    height: 'min-content',
                    marginTop: '30px'
                },
            },
        },
    }
});
