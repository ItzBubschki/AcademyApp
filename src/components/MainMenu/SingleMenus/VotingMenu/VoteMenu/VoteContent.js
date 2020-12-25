import React from "react";
import VoteMenuHeader from "../../../Header/VoteMenuHeader";
import * as ROUTES from "../../../../../constants/routes";
import {
    Button,
    CircularProgress,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from "@material-ui/core";
import CanvasDraw from "react-canvas-draw";
import moment from "moment";
import "./style.css";

class VoteContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temporaryVotes: [],
            activeVote: "",
            candidateList: [],
            activeCanidate: "",
            eligible: true,
            ineligibleReason: "",
            loading: false,
            error: "",
        };
        this.defaultValues = {
            hideGrid: true,
            canvasWidth: 256,
            canvasHeight: 512,
            brushRadius: 5,
            lazyRadius: 0,
            brushColor: "#ffff",
            backgroundColor: "rgba(0,0,0,0.3)",
        };
        this.getTemporaryVotes();
        this.checkEligibleToVote();
    }

    getTemporaryVotes = async () => {
        const querySnapshot = await this.props.firebase
            .getCollection("temporaryVotes")
            .catch((error) => {
                this.setState({error: error});
                console.log(error);
            });
        let temporaryVotes = [];
        querySnapshot.docs.forEach((doc) => {
            let newVote = doc.data();
            newVote["id"] = doc.id;
            temporaryVotes.push(newVote);
        });
        const latestVote = temporaryVotes[temporaryVotes.length - 1];
        let candidateList = [];
        Object.keys(latestVote.CandidateList).forEach((candidate) => {
            candidateList.push(candidate);
        });
        this.setState({
            temporaryVotes: temporaryVotes,
            activeVote: latestVote,
            candidateList: candidateList,
        });
    };
    goBack = () => {
        this.props.history.push(ROUTES.VOTING);
    };

    handleChange = (event) => {
        this.setState({activeCanidate: event.target.value});
    };

    handleClick = async () => {
        this.setState({loading: true, eligible: false});
        let voteFunction = this.props.firebase.callFunction("voteForCandidate");
        await voteFunction({
            candidate: this.state.activeCanidate,
            documentId: this.state.activeVote.id,
        });
        await this.saveDrawing();
        this.setState({loading: false});
        await this.getTemporaryVotes();
        this.goToOverview();
    };

    saveDrawing = async () => {
        const saveData = this.refs.canvas.getSaveData();
        const saveJson = JSON.parse(saveData);
        if (saveJson.lines !== undefined && saveJson.lines.length > 0) {
            const canvas = this.refs.outerCanvas;
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = "#000000";
            ctx.strokeStyle = "#ffffff";
            saveJson.lines.forEach((line) => {
                ctx.beginPath();
                ctx.moveTo(line.points[0].x, line.points.y);
                line.points.forEach((point) => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            });
            const currentMoment = moment().format("DD-MM-YYYY:h:mm:ss");
            const voteId = this.props.match.url.split("/")[3];
            const filepath = `${voteId}/${currentMoment}.png`;
            let blobBin = atob(canvas.toDataURL().split(",")[1]);
            let array = [];
            for (let i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            const file = new Blob([new Uint8Array(array)], {type: "image/png"});
            const activeVoteId = this.state.activeVote.id;
            const metadata = {
                Phase: activeVoteId,
            };
            const snapshot = await this.props.firebase.uploadImage(
                filepath,
                file,
                metadata
            );
            const url = await snapshot.ref.getDownloadURL();
            const data = {
                [`downloadUrls.${[this.props.firebase.getUid()]}`]: url,
            };
            this.props.firebase.updateDocument("temporaryVotes", activeVoteId, data);
            this.refs.canvas.clear();
        } else {
            console.log("didnt draw");
        }
    };

    checkEligibleToVote = async () => {
        return await this.props.firebase
            .orderAndLimitCollection("temporaryVotes", "PhaseCount", "desc", 1)
            .then(async (querySnapshot) => {
                const latestVote = querySnapshot.docs[0].data();
                const uid = this.props.firebase.getUid();
                let eligible = !Object.keys(latestVote).includes(uid);
                let ineligibleReason = "already Voted";
                if (latestVote.ExcludedCandidates !== undefined) {
                    Object.keys(latestVote.ExcludedCandidates).forEach((candidate) => {
                        if (candidate === localStorage.getItem("AcademyName")) {
                            eligible = false;
                            ineligibleReason = "part of tiebreaker";
                        }
                    });
                }
                const hasFullAccess = await this.props.firebase.checkFullAccess();
                if (!hasFullAccess) {
                    eligible = false;
                    ineligibleReason = "you don't have permission to vote";
                }
                this.setState({
                    eligible: eligible,
                    ineligibleReason: ineligibleReason,
                });
            })
            .catch((error) => {
                this.setState({error: error});
                console.log(error);
            });
    };

    goToOverview = () => {
        const redirectUrl = `${this.props.match.url}${ROUTES.ROUND_OVERVIEW}`;
        this.props.history.push({
            pathname: redirectUrl,
            state: {
                temporaryVotes: this.state.temporaryVotes,
            },
        });
    };

    clearImage = () => {
        this.refs.canvas.clear();
    };

    render() {
        const candidateList = this.state.candidateList.map((candidate) => {
            if (candidate !== localStorage.getItem("AcademyName")) {
                return (
                    <MenuItem key={candidate} value={candidate}>
                        {candidate}
                    </MenuItem>
                );
            } else {
                return null;
            }
        });
        return (
            <div style={{marginTop: "12vh"}}>
                <canvas
                    style={{position: "fixed", marginTop: "-100vh"}}
                    ref="outerCanvas"
                    display="none"
                    width="256"
                    height="512"
                />
                <VoteMenuHeader
                    handleClick={this.goBack}
                    goToOverview={this.goToOverview}
                    activeVote={this.state.activeVote}
                />
                <div className="VoteMenu">
                    <Container component="main" maxWidth="xs">
                        <div className="candidateSelection">
                            <FormControl
                                required
                                error={!this.state.eligible}
                                className="formControl"
                            >
                                <InputLabel id="voteSelection">Candidate</InputLabel>
                                <Select
                                    labelId="selectCandidateLabel"
                                    id="selectCandidate"
                                    value={this.state.activeCanidate}
                                    onChange={this.handleChange}
                                >
                                    {candidateList}
                                </Select>
                                {!this.state.eligible ? (
                                    <FormHelperText>{this.state.ineligibleReason}</FormHelperText>
                                ) : (
                                    ""
                                )}
                            </FormControl>
                        </div>
                        <div className="drawingArea">
                            <CanvasDraw
                                hideGrid={this.defaultValues.hideGrid}
                                canvasWidth={this.defaultValues.canvasWidth}
                                canvasHeight={this.defaultValues.canvasHeight}
                                brushRadius={this.defaultValues.brushRadius}
                                lazyRadius={this.defaultValues.lazyRadius}
                                brushColor={this.defaultValues.brushColor}
                                backgroundColor={this.defaultValues.backgroundColor}
                                ref="canvas"
                            />
                        </div>
                        {this.state.loading ? (
                            <CircularProgress style={{position: "fixed"}}/>
                        ) : (
                            ""
                        )}
                        <div className="buttonArea">
                            <Grid container space={2}>
                                <Grid item xs={6}>
                                    <Button variant="contained" onClick={this.clearImage}>
                                        Clear
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        disabled={
                                            !(this.state.eligible && this.state.activeCanidate !== "")
                                        }
                                        variant="contained"
                                        onClick={() => this.handleClick()}
                                    >
                                        Confirm
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

export default VoteContent;
