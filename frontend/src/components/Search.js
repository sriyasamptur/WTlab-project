import React, { useEffect, useState } from 'react';
import Movies from './Movies'
//import { getMovies } from './MovieFunctions'

function Search() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('/movies?search=' + localStorage.getItem('query') + '&limit=50')
        .then(response =>
            response.json().then(data => {
                console.log(data)
                setMovies(data.movies);
            })
        );
    }, []);

    return (
        <div className='.f2 tc pa4'>
            <h1 id='title'>Searched Movies</h1>
            <Movies movies={movies} />
        </div>
    )  
}

export default Search;