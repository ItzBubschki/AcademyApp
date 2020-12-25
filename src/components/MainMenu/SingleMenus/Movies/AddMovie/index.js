import React from "react";
import {compose} from "recompose";

import AddMovieContent from "./AddMovieContent";
import Header from "../../../Header";
import {withFirebase} from "../../../../Firebase";
import {withRouter} from "react-router-dom";

const AddMovie = (props) => (
    <div>
        <Header/>
        <AddMovieBase/>
    </div>
);

const AddMovieBase = compose(withRouter, withFirebase)(AddMovieContent);

export default AddMovie;

export {AddMovieBase};
