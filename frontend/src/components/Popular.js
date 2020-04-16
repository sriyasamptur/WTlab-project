import Movies from "./Movies";
import React, { useEffect, useState } from "react";

function Popular() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch("/index").then(response =>
            response.json().then(data => {
                // console.log(data.movies)
                setMovies(data.movies);
            })
        );
    }, []);

    return (
        <div className='.f2 tc pa4'>
            <h1 id='title'>Popular Movies</h1>
            <Movies movies={movies} />
        </div>
    )  
}

export default Popular;