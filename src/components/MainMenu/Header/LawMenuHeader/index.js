import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import "./style.css";

class LawMenuHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lawType: props.lawType,
        };
    }

    render() {
        return (
            <AppBar position="fixed" color="inherit" className="ColorlessAppBar">
                <Toolbar>
                    <Grid container spacing={3} className="LawHeader">
                        <Grid item xs={1} className="LawGridItem">
                            <IconButton
                                className="BackButton"
                                aria-label="MenuIcon"
                                onClick={() => this.props.handleClick(false)}
                            >
                                <div>
                                    <ArrowBackIosIcon/>
                                </div>
                            </IconButton>
                        </Grid>
                        <Grid item xs={10} className="MovieGridItem">
                            {this.props.lawType}
                        </Grid>
                        <Grid item xs={1} className="MovieGridItem">
                            <IconButton
                                className="NextButton"
                                aria-label="MenuIcon"
                                onClick={() => this.props.handleClick(true)}
                            >
                                <div>
                                    <ArrowForwardIosIcon/>
                                </div>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

export default LawMenuHeader;
