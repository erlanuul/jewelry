import {createTheme, FormControl, outlinedInputClasses, Select, styled, TextField} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";

declare module '@mui/material/styles' {
    interface Palette {
        blue: Palette['primary'];
        gray: Palette['primary'];
        black: Palette['primary'];
    }

    interface PaletteOptions {
        blue?: PaletteOptions['primary'];
        gray?: PaletteOptions['primary'];
        black?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        blue: true;
        gray: true;
        black: true;
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
        gray: {
            main: '#6E6C6A',
            light: '#CED0D2',
            dark: '#6E6C6A',
            contrastText: '#6E6C6A',
        },
        black: {
            main: '#2A2826',
            light: 'rgba(42,40,38,0.95)',
            dark: '#1a1918',
            contrastText: '#FFFFFF',
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
    }
});


export const CustomTextField = styled(TextField)({
    // Root styles
    '--TextField-brandBorderColor': '#CED0D2',
    '--TextField-brandBorderHoverColor': '#6E6C6A',
    '--TextField-brandBorderFocusedColor': '#6E6C6A',
    '--TextField-inputBackground': '#F6F6F6',
    marginTop: 30,

    // Label styles
    '& label': {
        position: 'absolute',
        top: -20,
        left: 0,
        transform: 'translateY(-50%)',
        zIndex: 1,
        pointerEvents: 'none',
        color: '#6E6C6A',
    },
    '& label.Mui-focused': {
        color: 'var(--TextField-brandBorderFocusedColor)',
    },

    // Fieldset styles
    '& fieldset': {
        borderColor: 'var(--TextField-brandBorderColor)',
        top: 0,
    },
    '& fieldset legend': {
        display: 'none',
    },

    '& .MuiInputBase-root': {
        borderRadius: 100,
        background: '#F6F6F6',
    },

    [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: 'var(--TextField-brandBorderFocusedColor)',
    },
});

export const CustomFormControl = styled(FormControl)({
    '--TextField-brandBorderColor': '#CED0D2',
    '--TextField-brandBorderHoverColor': '#6E6C6A',
    '--TextField-brandBorderFocusedColor': '#6E6C6A',
    marginTop: '30px',

    // Label styles
    '& label': {
        position: 'absolute',
        top: -20,
        left: 0,
        transform: 'translateY(-50%)',
        zIndex: 1,
        pointerEvents: 'none',
        color: '#6E6C6A',
    },
    '& label.Mui-focused': {
        color: 'var(--TextField-brandBorderFocusedColor)',
    },

    // Fieldset styles
    '& fieldset': {
        borderColor: 'var(--TextField-brandBorderColor)',
        top: 0,
    },

    '& fieldset legend': {
        display: 'none',
    },

    '& .MuiInputBase-root': {
        borderRadius: 100,
        background: '#F6F6F6',
    },

    [`&.Mui-focused .MuiOutlinedInput-notchedOutline`]: {
        borderColor: 'var(--TextField-brandBorderFocusedColor)',
    },
});

export const CustomDatePicker = styled(DatePicker)({
    // Root styles
    '--TextField-brandBorderColor': '#CED0D2',
    '--TextField-brandBorderHoverColor': '#6E6C6A',
    '--TextField-brandBorderFocusedColor': '#6E6C6A',
    '--TextField-inputBackground': '#F6F6F6',
    marginTop: 30,

    // Label styles
    '& label': {
        position: 'absolute',
        top: -20,
        left: 0,
        transform: 'translateY(-50%)',
        zIndex: 1,
        pointerEvents: 'none',
        color: '#6E6C6A',
    },
    '& label.Mui-focused': {
        color: 'var(--TextField-brandBorderFocusedColor)',
    },

    // Fieldset styles
    '& fieldset': {
        borderColor: 'var(--TextField-brandBorderColor)',
        top: 0,
    },
    '& fieldset legend': {
        display: 'none',
    },

    '& .MuiInputBase-root': {
        borderRadius: 100,
        background: '#F6F6F6',
    },

    [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: 'var(--TextField-brandBorderFocusedColor)',
    },
});

export const CustomRoundedDatePicker = styled(DatePicker)({
    '& .MuiInputBase-root': {
        borderRadius: 100,
    },
});