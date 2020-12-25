import React from "react";
import {compose} from "recompose";

import SignOutContent from "./SignOutContent";
import {withFirebase} from "../../Firebase";
import {withRouter} from "react-router-dom";

const SignOutButton = () => (
    <div>
        <SignOutBase/>
    </div>
);

const SignOutBase = compose(withRouter, withFirebase)(SignOutContent);

export default SignOutButton;

export {SignOutBase};
