import React from "react";
import Button from "@material-ui/core/Button";

function NameButton(props) {
    const UserName = props.UserName;
    return (
        <Button
            fullWidth
            variant="contained"
            color="primary"
            name={UserName}
            onClick={() => props.handleClick(UserName)}
            className="nameButton"
        >
            {UserName}
        </Button>
    );
}

export default NameButton;
