import {createMuiTheme} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";

import './index.css';

const font = "'Raleway', 'sans-serif'";

const darkTheme = createMuiTheme({
    palette: {
        type: "dark",
        primary: blue,
        secondary: {
            main: "#212D3D",
        },
    },
    typography: {
        fontFamily: font,
        button: {
            textTransform: "none"
        }
    }
});

export default darkTheme;
