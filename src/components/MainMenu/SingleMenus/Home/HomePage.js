import React from "react";
import {compose} from "recompose";

import HomeContent from "./HomeContent";
import {withFirebase} from "../../../Firebase";

const HomePage = () => (
    <div>
        <HomeContentBase/>
    </div>
);

const HomeContentBase = compose(withFirebase)(HomeContent);

export default HomePage;

export {HomeContentBase};
