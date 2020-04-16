import React, { Component } from 'react';
import "./style.css";
import axios from 'axios';
import { API_URL, API_KEY } from '../config';

class MovieDetails extends Component {
    constructor(props) {
        super(props);
        this.state = { title: '', genres: [], release_date: '', overview: '', cast3: [], directors: [] };
    }

    componentDidMount() {
        axios.get(API_URL + this.props.id + '?api_key=' + API_KEY + "&append_to_response=credits")
            .then(res => {
                const title = res.data.title;
                const genres = res.data.genres;
                const release_date = res.data.release_date;
                const overview = res.data.overview;
                const cast3 = res.data.credits.cast.slice(0, 3);
                const directors = [];
                res.data.credits.crew.forEach(function (entry) {
                    if (entry.job === 'Director') {
                        directors.push(entry);
                    }
                })
                this.setState({ title, genres, release_date, overview, cast3, directors });
            })
    }

    // Only use for genres, cast3, and directors
    // These arrays have objects with variable name
    getNames(arr) {
        var text = '';
        var i;
        for (i = 0; i < arr.length; i++) {
            text = text + arr[i].name + ', ';
        }
        return text.substring(0, text.length - 2);
    }

    render() {
        return (
            <div className='moviedetails' onClick={this.props.close}>
                <div className='moviedetailsinner'>
                    <h1 className='text-primary text-center'>{this.state.title}</h1>
                    <h3 className='moviedetails_subtitle'>Directors</h3>
                    <p className='moviedetails_text'>{this.getNames(this.state.directors)}</p>
                    <h3 className='moviedetails_subtitle'>Cast</h3>
                    <p className='moviedetails_text'>{this.getNames(this.state.cast3)}</p>
                    <h3 className='moviedetails_subtitle'>Release Date</h3>
                    <p className='moviedetails_text'>{this.state.release_date}</p>
                    <h3 className='moviedetails_subtitle'>Genre</h3>
                    <p className='moviedetails_text'>{this.getNames(this.state.genres)}</p>
                    <h3 className='moviedetails_subtitle'>Overview</h3>
                    <p className='moviedetails_text'>{this.state.overview}</p>
                </div>
            </div>
        );
    }
}

export default MovieDetails;