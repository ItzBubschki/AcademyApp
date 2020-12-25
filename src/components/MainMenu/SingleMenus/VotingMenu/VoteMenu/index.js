import React from "react";
import {compose} from "recompose";

import VoteContent from "./VoteContent";
import Header from "../../../Header";
import {withFirebase} from "../../../../Firebase";
import {withRouter} from "react-router-dom";
import {withAuthorization} from "../../../../Session";

const VoteMenu = () => (
    <div>
        <Header/>
        <VoteContentBase/>
    </div>
);

const VoteContentBase = compose(withRouter, withFirebase)(VoteContent);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(VoteMenu);

export {VoteContentBase};
