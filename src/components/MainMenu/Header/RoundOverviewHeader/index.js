import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import "./style.css";

function RoundOverviewHeader(props) {
    return (
        <AppBar position="fixed" color="inherit" className="OverviewBar">
            <Toolbar>
                <Grid container spacing={2} className="OverviewHeader">
                    <Grid item xs={1} className="OverviewGridItem">
                        <IconButton
                            className="OverviewBackButton"
                            aria-label="MenuIcon"
                            onClick={() => props.handleClick()}
                        >
                            <ArrowBackIosIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={11} className="OverviewGridItem">
                        Runden Übersicht:
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default RoundOverviewHeader;
