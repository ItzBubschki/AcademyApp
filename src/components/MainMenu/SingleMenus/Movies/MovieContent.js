import React from 'react';
import Container from '@material-ui/core/Container';
import {Box, Grid} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import * as ROUTES from '../../../../constants/routes';
import './style.css';
import MovieOverviewHeader from '../../Header/MovieOverviewHeader';

class MovieContent extends React.Component {
    constructor(props) {
        super(props);
        let sortedBy = 'alphabetical';
        let sortedPreference = localStorage.getItem('sortedBy');
        if (sortedPreference !== '') {
            sortedBy = sortedPreference;
        } else {
            localStorage.setItem('sortedBy', sortedBy);
        }
        let inspectedMovie = '';
        if (
            props.history.location.state &&
            props.history.location.state.inspectedMovie !== ''
        ) {
            inspectedMovie = props.history.location.state.inspectedMovie;
        }

        this.state = {
            Movies: [],
            searchField: '',
            sortedBy: sortedBy,
            inspectedMovie: inspectedMovie,
            hasFullAccess: false,
            error: ''
        };
        this.checkAuthentication().then(() => this.getMovieList());
    }

    checkAuthentication = async () => {
        let hasFullAccess = false;
        if (this.props.firebase.isUserLoggedIn()) {
            hasFullAccess = await this.props.firebase.checkFullAccess();
        } else {
            await this.props.firebase.setStatePersistence('local').then(() => this.props.firebase.logInAnonymously());
        }
        this.setState({hasFullAccess: hasFullAccess});
    };
    getMovieList = () => {
        this.props.firebase
            .orderCollection('Movies', 'MovieName', 'asc')
            .then((querySnapshot) => {
                let movieList = [];
                querySnapshot.docs.forEach((movie) => {
                    let MovieObject = movie.data();
                    MovieObject['id'] = movie.id;
                    movieList.push(MovieObject);
                });
                this.setState({Movies: movieList});
                this.sortMovieList(localStorage.getItem('sortedBy'));
            })
            .catch((error) => {
                this.setState({error: error});
            });
    };

    redirectToMovie = (movie) => {
        const redirectLink = `${ROUTES.MOVIES}${ROUTES.SINGLE_MOVIE.replace(
            ':id',
            movie.id
        )}`;
        this.props.history.push({
            pathname: redirectLink,
            state: {transferedMovie: movie}
        });
    };

    createNewMovie = () => {
        const redirectLink = `${ROUTES.MOVIES}${ROUTES.ADD_MOVIE}`;
        this.props.history.push(redirectLink);
    };

    searchForMovie = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    };

    switchSortedBy = () => {
        let sortedBy = '';
        switch (this.state.sortedBy) {
            case 'rating':
                sortedBy = 'alphabetical';
                break;
            case 'date':
                sortedBy = 'rating';
                break;
            default:
                sortedBy = 'date';
                break;
        }
        localStorage.setItem('sortedBy', sortedBy);
        this.setState({sortedBy: sortedBy});
        this.sortMovieList(sortedBy);
    };

    sortMovieList = (orderBy) => {
        let newMovieList = this.state.Movies;

        switch (orderBy) {
            case 'rating':
                newMovieList.sort(function (a, b) {
                    if (a.TotalRating > b.TotalRating) {
                        return -1;
                    } else if (a.TotalRating < b.TotalRating) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
            case 'date':
                newMovieList.sort(function (a, b) {
                    if (a.WatchDate > b.WatchDate) {
                        return -1;
                    } else if (a.WatchDate < b.WatchDate) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
            default:
                newMovieList.sort(function (a, b) {
                    if (a.MovieName < b.MovieName) {
                        return -1;
                    } else if (a.TotalRating > b.TotalRating) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                break;
        }
        this.setState({Movies: newMovieList});
    };

    render() {
        let currentList = [];
        this.state.Movies.forEach((movie) => {
            if (
                movie.MovieName.toLowerCase().includes(
                    this.state.searchField.toLowerCase()
                )
            ) {
                currentList.push(movie);
            }
        });
        const MovieList = currentList.map((movie) => (
            <MovieObject
                key={movie.MovieName}
                movie={movie}
                handleClick={this.redirectToMovie}
                inspected={this.state.inspectedMovie === movie.MovieName}
            />
        ));
        return (
            <div style={{marginTop: '12vh'}}>
                <MovieOverviewHeader
                    handleChange={this.searchForMovie}
                    handleClick={this.switchSortedBy}
                    searchText={this.state.searchField}
                    sortedBy={this.state.sortedBy}
                />
                <Container>
                    <div className="MovieList">
                        <Box my={2}>
                            <div>{MovieList}</div>
                        </Box>
                        {this.state.hasFullAccess ? (
                            <div className="AddButtonDiv">
                                <IconButton className="AddButton" onClick={this.createNewMovie}>
                                    <AddCircleIcon id="CircleButton"/>
                                </IconButton>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </Container>
            </div>
        );
    }
}

class MovieObject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: props.movie,
            alreadyVoted: true,
            inspected: props.inspected
        };
    }

    updateAlreadyVoted = () => {
        if (this.state.movie.New) {
            if (
                !(localStorage.getItem('AcademyName') in this.state.movie.SingleRatings)
            ) {
                this.setState({alreadyVoted: false});
            }
        }
    };

    render() {
        return (
            <div
                className="MovieObject"
                onClick={() => this.props.handleClick(this.state.movie)}
                style={!this.state.alreadyVoted ? {color: 'red'} : {}}
            >
                <Typography component="h1" variant="h5">
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            {this.state.movie.MovieName}
                        </Grid>
                        <Grid item xs={1}>
                            {Math.round((this.state.movie.TotalRating + Number.EPSILON) * 100) / 100}
                        </Grid>
                    </Grid>
                </Typography>
            </div>
        );
    }
}

export default MovieContent;
