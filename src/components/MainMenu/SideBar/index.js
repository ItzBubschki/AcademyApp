import React from "react";
import SideBarComponentList from "./SideBarComponentList";
import OpenDrawerComponent from "./OpenDrawerComponent";
import "./style.css";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";

function SideBar() {
    const [state, setState] = React.useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({...state, [anchor]: open});
    };

    const list = (anchor) => (
        <div
            className="fullList"
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <SideBarBase/>
        </div>
    );

    return (
        <div>
            <OpenDrawerComponent
                toggleDrawer={toggleDrawer}
                state={state}
                list={list}
            />
        </div>
    );
}

const SideBarBase = compose(withRouter, withFirebase)(SideBarComponentList);

export default SideBar;

export {SideBarBase};
