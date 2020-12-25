import React from "react";
import RoundOverviewElement from "./RoundOverviewElement";
import {withFirebase} from "../../../../../Firebase";
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

class RoundOverview extends React.Component {
    constructor(props) {
        super(props);
        const transferedHistory = props.history.location.state.temporaryVotes;
        if (transferedHistory !== null) {
            this.state = {
                rounds: transferedHistory,
            };
        }
    }

    render() {
        const overviewList = this.state.rounds.map((round) => (
            <RoundOverviewElementBase
                key={round.PhaseCount}
                roundCount={round.PhaseCount}
                round={round}
            />
        ));
        return <div style={{marginTop: "11vh"}}>{overviewList}</div>;
    }
}

const RoundOverviewElementBase = compose(
    withRouter,
    withFirebase
)(RoundOverviewElement);

export default RoundOverview;

export {RoundOverviewElementBase};
