import React from "react";
import {compose} from "recompose";

import MovieContent from "./MovieContent";
import Header from "../../Header";
import {withFirebase} from "../../../Firebase";
import {withRouter} from "react-router-dom";

const Movies = () => (
    <div>
        <Header/>
        <MovieContentBase/>
    </div>
);

const MovieContentBase = compose(withRouter, withFirebase)(MovieContent);

export default Movies;

export {MovieContentBase};
