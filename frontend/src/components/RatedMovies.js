import Movies from "./Movies";
import React, { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode'

function RatedMovies() {
    const [movies, setMovies] = useState([]);

    // get current username
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const user = decoded.identity.username;

    const url = "/rated_movies/" + user

    useEffect(() => {
        fetch(url).then(response =>
            response.json().then(data => {
                setMovies(data.movies);
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='.f2 tc pa4'>
            <h1 id='title'>Rated Movies</h1>
            <Movies movies={movies} />
        </div>
    )  
}

export default RatedMovies;