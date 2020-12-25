import React from "react";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import moment from "moment";
import * as ROUTES from "../../../../../constants/routes";
import {Button, Container, Grid, TextField, Typography,} from "@material-ui/core";
import "./style.css";

class AddMovieContent extends React.Component {
    constructor() {
        super();
        const currentDate = moment().format("yyyy-MM-DD");
        this.state = {
            MovieTitle: "",
            UserRating: "",
            WatchDate: currentDate,
            ThumbnailLink: "",
            loading: false,
            error: "",
        };
    }

    handleChange = (event) => {
        let {name, value} = event.target;
        if (name === "UserRating") {
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
        this.setState({
            [name]: value,
        });
    };

    closeAddMenu = () => {
        this.props.history.push(ROUTES.MOVIES);
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

    submitMovie = (event) => {
        this.setState({loading: true});
        const oldDate = new Date(this.state.WatchDate);
        let newMovie = {
            MovieName: this.state.MovieTitle,
            WatchDate: oldDate,
            New: true,
        };
        if (this.state.ThumbnailLink !== "") {
            newMovie["pictureLink"] = this.state.ThumbnailLink;
        }
        this.props.firebase
            .uploadDocument("Movies", newMovie)
            .then((documentReference) => {
                const data = {
                    movieId: documentReference.id,
                    person: localStorage.getItem("AcademyName"),
                    rating: this.state.UserRating,
                };
                let rateMovie = this.props.firebase.callFunction("rateMovie");
                rateMovie(data)
                    .then(() => {
                        const redirectLink = `${ROUTES.MOVIES}${ROUTES.SINGLE_MOVIE.replace(
                            ":id",
                            documentReference.id
                        )}`;
                        this.props.history.push(redirectLink);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error, loading: false});
            });

        event.preventDefault();
    };

    render() {
        return (
            <Container component="main" maxWidth="xs" style={{marginTop: "7vh"}}>
                <div className="paper">
                    <div className="CloseAddMenu">
                        <IconButton onClick={this.closeAddMenu}>
                            <CloseIcon id="CloseButton"/>
                        </IconButton>
                    </div>
                    <Typography component="h1" variant="h5">
                        Film hinzufügen
                    </Typography>
                    <form onSubmit={this.submitMovie}>
                        {this.state.ThumbnailLink !== "" ? (
                            <img
                                src={this.state.ThumbnailLink}
                                alt="movieThumbnail"
                                className="MovieThumbnail"
                            />
                        ) : (
                            ""
                        )}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="MovieTitle"
                            name="MovieTitle"
                            label="Titel"
                            autoFocus
                            onChange={this.handleChange}
                            value={this.state.MovieName}
                        />
                        <TextField
                            variant="outlined"
                            type="date"
                            margin="normal"
                            required
                            fullWidth
                            name="WatchDate"
                            label="Datum"
                            id="WatchDate"
                            onChange={this.handleChange}
                            value={this.state.WatchDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Grid container space={12}>
                            <Grid item xs={2} className="ChangeButtonContainer">
                                <IconButton onClick={() => this.changeRating(false)}>
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
                                    onChange={this.handleChange}
                                    value={this.state.UserRating}
                                />
                            </Grid>
                            <Grid item xs={2} className="ChangeButtonContainer">
                                <IconButton onClick={() => this.changeRating(true)}>
                                    <AddIcon className="ChangeRatingButton"/>
                                </IconButton>
                            </Grid>
                        </Grid>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="ThumbnailLink"
                            label="Link"
                            id="ThumbnailLink"
                            onChange={this.handleChange}
                            value={this.state.ThumbnailLink}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="submit"
                            disabled={this.state.loading}
                        >
                            Confirm
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default AddMovieContent;
