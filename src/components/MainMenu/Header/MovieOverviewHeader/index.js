import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import SortIcon from "@material-ui/icons/Sort";
import IconButton from "@material-ui/core/IconButton";
import SearchField from "../SearchField";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import "./style.css";

class MovieOverviewHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lawType: props.lawType,
        };
    }

    render() {
        let sortIcon;
        switch (this.props.sortedBy) {
            case "rating":
                sortIcon = <FormatListNumberedIcon id="sortIcon"/>;
                break;
            case "date":
                sortIcon = <AccessTimeIcon id="sortIcon"/>;
                break;
            default:
                sortIcon = <SortByAlphaIcon id="sortIcon"/>;
                break;
        }
        return (
            <AppBar position="fixed" color="inherit" className="MovieBar">
                <Toolbar>
                    <Grid container spacing={2} className="MovieOverviewHeader">
                        <Grid item xs={9} className="MovieGridItem">
                            <SearchField
                                handleChange={this.props.handleChange}
                                searchText={this.props.searchText}
                            />
                        </Grid>
                        <Grid item xs={3} className="MovieGridItem" id="sortMovieContent">
                            <IconButton
                                className="SortButton"
                                aria-label="MenuIcon"
                                onClick={() => this.props.handleClick()}
                            >
                                <div>
                                    {sortIcon}
                                    <SortIcon id="sortIcon"/>
                                </div>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

export default MovieOverviewHeader;
