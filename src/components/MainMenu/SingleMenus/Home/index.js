import React from "react";
import Header from "../../Header";
import HomePage from "./HomePage";
import * as ROUTES from "../../../../constants/routes";

const HomeMenu = () => {
    if ((localStorage.getItem("AcademyName") !== null && localStorage.getItem("AcademyName") !== "") || localStorage.getItem("loggedIn") !== "true") {
        return (
            <div>
                <Header style={{height: "5vh"}}/>
                <HomePage style={{marginTop: "5vh"}}/>
            </div>
        );
    } else {
        window.location.replace(ROUTES.NAME_SELECTION);
        return null;
    }
};

export default HomeMenu;
