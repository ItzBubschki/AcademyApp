import React from "react";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

function SignOutContent(props) {
    return (
        <div>
            <IconButton size="small" edge="end" id="signOutButton" onClick={() => logOut(props)}>
                <ExitToAppIcon
                    style={{
                        width: "50px",
                        height: "50px",
                    }}
                />
            </IconButton>
        </div>
    );
}

function logOut(props) {
    props.firebase.doSignOut();
    window.location.reload();
}

export default SignOutContent;
