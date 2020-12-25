import React from "react";
import {Container, List, ListItem} from "@material-ui/core";

class RoundOverviewChild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            round: props.round,
            downloadUrls: props.round.downloadUrls,
            ratings: props.round.Votes,
        };
    }

    render() {
        let drawingList = [];
        if (
            this.state.downloadUrls !== undefined &&
            Object.values(this.state.downloadUrls).length > 0
        ) {
            const urls = Object.values(this.state.downloadUrls);
            for (let i = 0; i < urls.length; i++) {
                drawingList.push(
                    <ListItem key={i}>
                        <img src={urls[i]} alt="drawing" className="drawing"/>
                    </ListItem>
                );
            }
        }

        let ratingList = [];
        if (
            this.state.ratings !== undefined &&
            Object.keys(this.state.ratings).length > 0
        ) {
            const ratings = Object.keys(this.state.ratings);
            for (let i = 0; i < ratings.length; i++) {
                ratingList.push(
                    <ListItem key={i}>{`${ratings[i]}: ${
                        this.state.ratings[ratings[i]]
                    }`}</ListItem>
                );
            }
        }
        return (
            <ListItem>
                <Container>
                    <div id="drawings">
                        <List>{drawingList}</List>
                    </div>
                    <div id="voteCounts">
                        <List>{ratingList}</List>
                    </div>
                </Container>
            </ListItem>
        );
    }
}

export default RoundOverviewChild;
