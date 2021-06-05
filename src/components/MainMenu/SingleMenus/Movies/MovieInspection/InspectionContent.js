import React from 'react';
import MovieInspectionHeader from '../../../Header/MovieInspectionHeader';
import * as ROUTES from '../../../../../constants/routes';
import {Button, CircularProgress, Container, Grid, IconButton, TextField} from '@material-ui/core';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import './style.css';
import checkFullAccess from '../../../../Firebase/FirebaseFunctions';

class InspectionContent extends React.Component {
    constructor(props) {
        super(props);
        let currentDate = '';
        if (
            props.history.location.state &&
            props.history.location.state.transferedMovie
        ) {
            const movie = props.history.location.state.transferedMovie;
            const watchDate = new Date(movie.WatchDate["seconds"] * 1000);
            currentDate = `${watchDate.getDate()}.${
                watchDate.getMonth() + 1
            }.${watchDate.getFullYear()}`;
            let canVote = false;
            if (movie.New) {
                if (
                    movie.SingleRatings === undefined ||
                    !Object.keys(movie.SingleRatings).includes(
                        localStorage.getItem("AcademyName")
                    )
                ) {
                    canVote = true;
                }
            }
            this.state = {
                movie: movie,
                movieId: props.match.params.id,
                isMovieNew: movie.New,
                ratingList: movie.SingleRatings,
                editing: false,
                updated: false,
                thumbnailLinkShowing: false,
                dateField: currentDate,
                MovieName: movie.MovieName,
                thumbnailLinkField: movie.pictureLink,
                loading: false,
                canVote: canVote,
                hasFullAccess: false,
                UserRating: "",
                error: "",
            };
        } else {
            this.state = {
                movie: "",
                movieId: props.match.params.id,
                isMovieNew: "",
                ratingList: "",
                editing: false,
                updated: false,
                thumbnailLinkShowing: false,
                dateField: currentDate,
                MovieName: "",
                thumbnailLinkField: "",
                loading: false,
                canVote: false,
                hasFullAccess: false,
                UserRating: "",
                error: "",
            };
        }
        this.getMovieData();
        this.checkFullAccess();
    }

    handleChange = (event) => {
        let {id, value} = event.target;
        if (id !== "UserRating") {
            this.setState({
                [id]: value,
            });
        } else {
            let {name} = event.target;
            if (value > 10) {
                value = 10;
            } else if (value < 0) {
                value = 0;
            } else if (value !== "") {
                value = parseInt(value);
            }
            this.setState({
                [name]: value,
            });
        }
    };
    getMovieData = () => {
        if (!this.state.movie || this.state.updated) {
            this.props.firebase
                .getDocument("Movies", this.state.movieId)
                .then((doc) => {
                    let newMovie = doc.data();
                    newMovie["id"] = doc.id;
                    const watchDate = new Date(newMovie.WatchDate["seconds"] * 1000);
                    let canVote = false;
                    if (
                        newMovie.New &&
                        newMovie.SingleRatings !== undefined &&
                        !Object.keys(newMovie.SingleRatings).includes(
                            localStorage.getItem("AcademyName")
                        )
                    ) {
                        canVote = true;
                    }
                    this.setState({
                        movie: newMovie,
                        movieId: this.props.match.params.id,
                        isMovieNew: newMovie.New,
                        ratingList: newMovie.SingleRatings,
                        editing: false,
                        updated: false,
                        thumbnailLinkShowing: false,
                        dateField: `${watchDate.getDate()}.${
                            watchDate.getMonth() + 1
                        }.${watchDate.getFullYear()}`,
                        MovieName: newMovie.MovieName,
                        thumbnailLinkField: newMovie.pictureLink,
                        loading: false,
                        canVote: canVote,
                        error: "",
                    });
                })
                .catch((error) => {
                    this.setState({error: error});
                });
        }
    };

    checkFullAccess = async () => {
        let hasFullAccess = false;
        console.log('Inspection checking if logged in.');
        if (this.props.firebase.auth.currentUser != null) {
            hasFullAccess = await checkFullAccess(this.props.firebase);
        }
        this.setState({hasFullAccess: hasFullAccess});
    };

    goBack = () => {
        this.props.history.push({
            pathname: ROUTES.MOVIES,
            state: {inspectedMovie: this.state.MovieName},
        });
    };

    flipThumbnailShowing = () => {
        this.setState({thumbnailLinkShowing: !this.state.thumbnailLinkShowing});
    };

    flipEditing = () => {
        const wasEditing = this.state.editing;
        this.setState({editing: !wasEditing});
        if (wasEditing) {
            this.setState({loading: true});
            this.updateDatabase();
        }
    };

    rateMovie = async () => {
        const data = {
            movieId: this.state.movieId,
            person: localStorage.getItem("AcademyName"),
            rating: this.state.UserRating,
        };

        const rateMovie = this.props.firebase.callFunction("rateMovie");
        this.setState({
            loading: true,
            isCurrentlyRating: false,
            canVote: false,
            updated: true,
        });
        await rateMovie(data);
        this.getMovieData();
    };

    flipMovieRatingField = () => {
        this.setState({isCurrentlyRating: !this.state.isCurrentlyRating});
    };

    changeRating = (raise) => {
        let value = this.state.UserRating;
        if (raise) {
            if (value === "" || value === 10) {
                value = 10;
            } else {
                value++;
            }
        } else {
            if (value === "" || value === 0) {
                value = 0;
            } else {
                value--;
            }
        }
        this.setState({UserRating: value});
    };

    updateDatabase = () => {
        let newMovie = {};
        let updated = false;
        const dateParts = this.state.dateField.split(".");
        if (dateParts.length === 3) {
            const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            const oldDate = new Date(this.state.movie.WatchDate.seconds * 1000);
            if (date !== oldDate) {
                newMovie["WatchDate"] = date;
                updated = true;
            }
        }
        if (this.state.thumbnailLinkField !== this.state.movie.pictureLink) {
            newMovie["pictureLink"] = this.state.thumbnailLinkField;
            updated = true;
        }
        if (this.state.MovieName !== this.state.movie.MovieName) {
            newMovie["MovieName"] = this.state.MovieName;
            updated = true;
        }
        if (updated) {
            this.setState({updated: true});
            this.props.firebase
                .updateDocument("Movies", this.state.movie.id, newMovie)
                .then(() => {
                    this.getMovieData();
                })
                .catch((error) => {
                    this.getMovieData();
                    this.setState({error: error, loading: false});
                });
        }
    };

    render() {
        let ratingList = {};
        if (this.state.isMovieNew) {
            let ratingItems = [];
            const singleRatings = this.state.movie.SingleRatings;
            Object.keys(singleRatings).forEach((element) => {
                ratingItems.push(
                    <RatingItem
                        key={element}
                        text={`${element}: ${singleRatings[element]}`}
                    />
                );
            });
            ratingList = <Grid container>{ratingItems}</Grid>;
        }
        return (
            <div>
                <MovieInspectionHeader
                    handleClick={this.goBack}
                    textValue={this.state.MovieName}
                    TotalRating={Math.round((this.state.movie.TotalRating + Number.EPSILON) * 100) / 100}
                    editing={this.state.editing}
                    handleChange={this.handleChange}
                />
                <Container className="InspectionContent">
                    <div>
                        <div onClick={this.flipThumbnailShowing}>
                            <img
                                src={this.state.movie.pictureLink}
                                alt="MovieThumbnail"
                                className="MovieThumbnail"
                            />
                        </div>
                        {this.state.loading ? (
                            <CircularProgress style={{position: "fixed"}}/>
                        ) : (
                            ""
                        )}
                        {this.state.thumbnailLinkShowing ? (
                            <div className="inspectionItem">
                                <div className="ThumbNailLink">
                                    <ThumbnailLink
                                        thumbnailLink={this.state.thumbnailLinkField}
                                        editing={this.state.editing}
                                        handleChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="inspectionItem">
                            <div className="IndividualRatings">
                                {this.state.isMovieNew ? ratingList : ""}
                            </div>
                        </div>
                        <div className="inspectionItem">
                            <TextField
                                id="dateField"
                                variant="outlined"
                                value={this.state.dateField}
                                className="DateText"
                                onChange={this.handleChange}
                                InputProps={{
                                    readOnly: !this.state.editing,
                                }}
                            />
                        </div>
                        {this.state.isCurrentlyRating ? (
                            <RateMovie
                                handleChange={this.handleChange}
                                UserRating={this.state.UserRating}
                                changeRating={this.changeRating}
                                rateMovie={this.rateMovie}
                            />
                        ) : (
                            ""
                        )}
                        <div>
                            {this.state.canVote ? (
                                <IconButton
                                    aria-label="rateIcon"
                                    className="rateIcon"
                                    onClick={this.flipMovieRatingField}
                                >
                                    <ThumbsUpDownIcon id="rateIcon"/>
                                </IconButton>
                            ) : (
                                ""
                            )}
                            {this.state.hasFullAccess ? (
                                <IconButton
                                    aria-label="editIcon"
                                    className="editIcon"
                                    id={this.state.editing ? "ActiveEditing" : ""}
                                    onClick={this.flipEditing}
                                >
                                    <EditIcon id="editIcon"/>
                                </IconButton>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

class ThumbnailLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = (event) => {
        this.props.handleChange(event);
    };

    render() {
        return (
            <div>
                <TextField
                    id="thumbnailLinkField"
                    label="Thumbnail Link"
                    variant="outlined"
                    value={this.props.thumbnailLink}
                    InputProps={{
                        readOnly: !this.props.editing,
                    }}
                    className="thumbnailLink"
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

function RatingItem(props) {
    return <Grid item>{props.text}</Grid>;
}

function RateMovie(props) {
    return (
        <div>
            <Grid container space={12}>
                <Grid item xs={2} className="ChangeButtonContainer">
                    <IconButton onClick={() => props.changeRating(false)}>
                        <RemoveIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        type="number"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="UserRating"
                        label="Bewertung"
                        id="UserRating"
                        onChange={props.handleChange}
                        value={props.UserRating}
                    />
                </Grid>
                <Grid item xs={2} className="ChangeButtonContainer">
                    <IconButton onClick={() => props.changeRating(true)}>
                        <AddIcon className="ChangeRatingButton"/>
                    </IconButton>
                </Grid>
            </Grid>
            <Button variant="outlined" color="primary" onClick={props.rateMovie}>
                Bewerten
            </Button>
        </div>
    );
}

export default InspectionContent;
