import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {IconButton} from "material-ui";
import MenuIcon from "@material-ui/icons/Menu";

function OpenDrawerComponent(props) {
    return (
        <div>
            <div>
                <IconButton
                    aria-label="MenuIcon"
                    onClick={props.toggleDrawer("left", true)}
                >
                    <div>
                        <MenuIcon className="MenuIconButton"/>
                    </div>
                </IconButton>
                <div>
                    <SwipeableDrawer
                        anchor={"left"}
                        open={props.state["left"]}
                        onClose={props.toggleDrawer("left", false)}
                        onOpen={props.toggleDrawer("left", true)}
                    >
                        {props.list("left")}
                    </SwipeableDrawer>
                </div>
            </div>
        </div>
    );
}

export default OpenDrawerComponent;
