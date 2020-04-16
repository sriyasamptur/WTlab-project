import Movies from "./Movies";
import React, { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode'

function RatedMovies() {
    const [movies1, setMovies1] = useState([]);
    const [movies2, setMovies2] = useState([]);

    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const user = decoded.identity.username;

    const url1 = "/rated_movies/" + user
    const url2 = "/rec_movies/" + user

    var xhr = new XMLHttpRequest();
    if(xhr){
        xhr.open('GET', url1 ,true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                setMovies1(xhr.responseText.movies);
                setTimeout(()=>{
                    xhr.open('GET', url2, true );
                    xhr.onreadystatechange = function(){
                        if(xhr.readyState === 4 && xhr.status === 200){
                            setMovies2(xhr.responseText.movies);
                        }
                    }
                    xhr.send(null);
                },5000);
            }
        }
        xhr.send(null);
    }

    return (
        <div className='.f2 tc pa4'>
            <h1 id='title'>Rated Movies</h1>
            <Movies movies1={movies1}/>
            <h1>Recommended Movies</h1>
            <Movies movies2={movies2} />
        </div>
    )  
}

export default RatedMovies;