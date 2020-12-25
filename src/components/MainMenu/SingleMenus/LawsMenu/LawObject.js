import React from "react";
import {Collapse, List, ListItem} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListItemText from "@material-ui/core/ListItemText";

import './style.css'

class LawObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            law: props.law,
            lawName: props.law.id,
            childTexts: props.law.LawTexts,
        };
    }

    flipExpand = () => {
        this.setState({open: !this.state.open});
    };

    render() {
        const childList = this.state.childTexts.map((lawChild) => (
            <LawObjectChild key={lawChild} text={lawChild}/>
        ));
        return (
            <div>
                <List>
                    <ListItem button onClick={this.flipExpand}>
                        <ListItemText primary={this.props.law.id}/>
                        {this.state.open ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {childList}
                        </List>
                    </Collapse>
                </List>
            </div>
        );
    }
}

function LawObjectChild(props) {
    return (
        <ListItem>
            <ListItemText primary={props.text}/>
        </ListItem>
    );
}

export default LawObject;
