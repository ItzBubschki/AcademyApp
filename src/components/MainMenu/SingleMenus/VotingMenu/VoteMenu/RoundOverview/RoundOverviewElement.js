import React from "react";
import {Collapse, List, ListItem} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListItemText from "@material-ui/core/ListItemText";
import RoundOverviewChild from "./RoundOverviewChild";
import Header from "../../../../Header";
import * as ROUTES from "../../../../../../constants/routes";
import RoundOverviewHeader from "../../../../Header/RoundOverviewHeader";

class RoundOverviewElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            round: props.round,
        };
    }

    flipExpand = () => {
        this.setState({open: !this.state.open});
    };

    goBack = () => {
        const voteId = this.props.match.url.split("/")[3];
        const redirectUrl = `${ROUTES.VOTING}${ROUTES.SINGLE_VOTE.replace(
            ":id",
            voteId
        )}`;
        this.props.history.push(redirectUrl);
    };

    render() {
        return (
            <div>
                <Header/>
                <RoundOverviewHeader handleClick={this.goBack}/>
                <List>
                    <ListItem button onClick={this.flipExpand}>
                        <ListItemText primary={this.props.roundCount}/>
                        {this.state.open ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <RoundOverviewChild round={this.state.round}/>
                        </List>
                    </Collapse>
                </List>
            </div>
        );
    }
}

export default RoundOverviewElement;
