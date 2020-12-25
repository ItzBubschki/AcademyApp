import React from "react";
import {compose} from "recompose";

import VotingHistoryContent from "./VotingHistoryContent";
import Header from "../../Header";
import {withFirebase} from "../../../Firebase";
import {withRouter} from "react-router-dom";
import {withAuthorization} from "../../../Session";

const VotingMenu = (props) => (
    <div>
        <Header/>
        <VotingContentBase/>
    </div>
);

const VotingContentBase = compose(
    withRouter,
    withFirebase
)(VotingHistoryContent);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(VotingMenu);

export {VotingContentBase};
