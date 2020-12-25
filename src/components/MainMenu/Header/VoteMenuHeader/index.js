import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import HistoryIcon from "@material-ui/icons/History";
import "./style.css";

function VoteMenuHeader(props) {
    return (
        <AppBar position="fixed" color="inherit" className="VoteBar">
            <Toolbar>
                <Grid container spacing={3} className="VoteHeader">
                    <Grid item xs={1} className="VoteGridItem">
                        <IconButton
                            className="BackButton"
                            aria-label="MenuIcon"
                            onClick={props.handleClick}
                        >
                            <ArrowBackIosIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={10} className="VoteGridItem">
                        {props.activeVote.Phase}
                    </Grid>
                    <Grid item xs={1} className="VoteGridItem">
                        {`${props.activeVote.voteCount}/${props.activeVote.maximumVotes}`}
                    </Grid>
                </Grid>
                <IconButton id="overviewButton" onClick={() => props.goToOverview()}>
                    <HistoryIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default VoteMenuHeader;
