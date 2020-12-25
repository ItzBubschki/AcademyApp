import React from "react";
import {compose} from "recompose";

import InspectionContent from "./InspectionContent";
import {withFirebase} from "../../../../Firebase";
import {withRouter} from "react-router-dom";
import Header from "../../../Header";

const Movies = (props) => (
    <div>
        <Header/>
        <InspectionContentBase/>
    </div>
);

const InspectionContentBase = compose(
    withRouter,
    withFirebase
)(InspectionContent);


export default Movies;

export {InspectionContentBase};
