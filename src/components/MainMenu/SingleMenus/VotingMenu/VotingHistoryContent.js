import React from 'react';
import {CircularProgress, Grid, IconButton, Typography} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import moment from 'moment';
import * as ROUTES from '../../../../constants/routes';
import './style.css';

class VotingHistoryContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [],
            loading: false,
            voteCreatable: false,
            error: '',
            hasFullAccess: false
        };
    }

    componentDidMount() {
        this.checkFullAccess().then(() => {
            if (this.state.hasFullAccess) {
                this.getVotingHistory();
            } else {
                const currentPage = window.location.href.split('/')[3];
                const destination = ROUTES.SIGN_IN + `?redirect_to=${currentPage}`;
                this.props.history.push(destination);
            }
        });
    }

    getVotingHistory = () => {
        this.props.firebase
            .orderCollection('Voting', 'votingDate', 'asc')
            .then((querySnapshot) => {
                let history = [];
                let voteCreatable = true;
                querySnapshot.docs.forEach((vote) => {
                    let newVote = vote.data();
                    const oldDate = new Date(newVote.votingDate.seconds * 1000);
                    newVote['votingDate'] = moment(oldDate).format('DD.MM.YYYY');
                    newVote['id'] = vote.id;
                    if (!newVote['Completed']) {
                        voteCreatable = false;
                    }
                    history.push(newVote);
                });
                this.setState({
                    history: history,
                    loading: false,
                    voteCreatable: voteCreatable
                });
            })
            .catch((error) => {
                this.setState({error: error});
                console.log(error);
            });
    };

    checkFullAccess = async () => {
        const hasFullAccess = await this.props.firebase.checkFullAccess();
        this.setState({hasFullAccess: hasFullAccess});
    };

    handleClick = (id) => {
        const redirectLink = `${ROUTES.VOTING}${ROUTES.SINGLE_VOTE.replace(
            ':id',
            id
        )}`;
        this.props.history.push(redirectLink);
    };

    createNewVote = async () => {
        this.setState({loading: true});
        const createNewVote = this.props.firebase.callFunction('createNewVote');
        createNewVote()
            .then(() => {
                this.getVotingHistory();
            })
            .catch((error) => {
                this.setState({error: error, loading: false});
                console.log(error);
            });
    };

    render() {
        const historyList = this.state.history.map((element) => {
            if (element.Completed) {
                return (
                    <VotingHistoryObject
                        key={element.id}
                        date={element.votingDate}
                        winner={element.President}
                    />
                );
            } else {
                return (
                    <ActiveVoteObject
                        key={element.id}
                        date={element.votingDate}
                        id={element.id}
                        handleClick={this.handleClick}
                    />
                );
            }
        });
        return (
            <div style={{marginTop: '6vh'}}>
                {historyList}
                {this.state.loading ? (
                    <CircularProgress style={{position: 'fixed'}}/>
                ) : (
                    ''
                )}
                {this.state.voteCreatable && this.state.hasFullAccess ? (
                    <div className="AddButtonDiv">
                        <IconButton className="AddButton" onClick={this.createNewVote}>
                            <AddCircleIcon id="CircleButton"/>
                        </IconButton>
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

function VotingHistoryObject(props) {
    return (
        <div className="votingHistoryObject">
            <Typography component="h1" variant="h5">
                <Grid container space={2}>
                    <Grid item xs={6} className="HistoryGridItem">
                        {props.date}
                    </Grid>
                    <Grid item xs={6} className="HistoryGridItem">
                        {props.winner}
                    </Grid>
                </Grid>
            </Typography>
        </div>
    );
}

function ActiveVoteObject(props) {
    return (
        <div className="votingHistoryObject" onClick={() => props.handleClick(props.id)}>
            <Typography component="h1" variant="h5">
                <Grid container space={2} style={{color: 'red'}}>
                    <Grid item xs={6} className="HistoryGridItem">
                        {props.date}
                    </Grid>
                    <Grid item xs={6} className="HistoryGridItem">
                        Wählen
                    </Grid>
                </Grid>
            </Typography>
        </div>
    );
}

export default VotingHistoryContent;
