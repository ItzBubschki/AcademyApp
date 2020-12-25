import React from "react";
import {compose} from "recompose";

import LawContent from "./LawContent";
import Header from "../../Header";
import {withFirebase} from "../../../Firebase";
import {withRouter} from "react-router-dom";

const Laws = (props) => (
    <div>
        <Header/>
        <LawContentBase/>
    </div>
);

const LawContentBase = compose(withRouter, withFirebase)(LawContent);

export default Laws;

export {LawContentBase};
