import React from "react";
import ReactDOM from "react-dom";

import Firebase, {FirebaseContext} from "./components/Firebase";
import App from "./components/App";
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import darkTheme from "./darktheme";
import {MuiThemeProvider} from "material-ui/styles";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <div>
            <MuiThemeProvider>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline/>
                    <App/>
                </ThemeProvider>
            </MuiThemeProvider>
        </div>
    </FirebaseContext.Provider>,
    document.getElementById("root")
);

serviceWorker.register();
