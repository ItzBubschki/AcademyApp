import React from "react";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

import NameList from "./NameList";
import {withFirebase} from "../../Firebase";
import {withAuthorization} from "../../Session";

const NameSelectionPage = () => (
    <div>
        <NameSelectionForm/>
    </div>
);

const NameSelectionForm = compose(withRouter, withFirebase)(NameList);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(NameSelectionPage);

export {NameSelectionForm};
