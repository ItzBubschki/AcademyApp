import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import "./style.css";
import {TextField} from "@material-ui/core";

class MovieInspectionHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChange = (event) => {
        this.props.handleChange(event);
    }

    render() {
        return (
            <AppBar position="static" color="transparent" className="ColorlessAppBar">
                <Toolbar>
                    <Grid container spacing={3} className="MovieHeader">
                        <Grid item xs={1} className="MovieGridItem">
                            <IconButton
                                className="BackButton"
                                aria-label="MenuIcon"
                                onClick={() => this.props.handleClick()}
                            >
                                <div>
                                    <ArrowBackIosIcon/>
                                </div>
                            </IconButton>
                        </Grid>
                        <Grid item xs={9} className="MovieGridItem">
                            <TextField
                                className="MovieNameField"
                                id="MovieName"
                                defaultValue={this.props.textValue}
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: !this.props.editing,
                                    disableUnderline: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2} className="MovieGridItem">
                            <div className="MovieRating">{this.props.TotalRating}</div>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

export default MovieInspectionHeader;
