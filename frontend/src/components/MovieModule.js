import React, { Component } from 'react';
import { Rating, Card, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import no_img from './no_image.png'
import { rate } from './UserFunctions'
import jwt_decode from 'jwt-decode'
import MovieDetails from './MovieDetails'

class MovieModule extends Component {
    constructor(props) {
        super(props);
        this.state = { showMovieDetails: false};
    }

    toggleMovieDetails() {
        this.setState({
            showMovieDetails: !this.state.showMovieDetails
        });
    }
    render() {

        var img_src = "";
        if (this.props.movie.poster === "#N/A") {
            img_src = no_img;
        } else {
            img_src = "http://image.tmdb.org/t/p/w300" + this.props.movie.poster;
        }

        return (
            <div className='dib pa3 zoom'>
                <Card>
                    <Image src={img_src} wrapped ui={false}  onClick={this.toggleMovieDetails.bind(this)}/>
                    <Card.Content>
                        <Card.Header>{this.props.movie.title}</Card.Header>
                    </Card.Content> 
                    <Card.Content>
                        <Rating 
                        rating = {this.props.movie.rating}
                        size='massive' 
                        icon='star' 
                        maxRating={5}
                        clearable 
                        onRate={async (_, data) => {
                            if (!localStorage.usertoken) {
                                window.alert("Your rating is not saved. You need to log in first.");
                            }
                            else {
                                const token = localStorage.usertoken
                                const decoded = jwt_decode(token)
                                const user = decoded.identity.username;
                                const title = this.props.movie.title;
                                const rating = data.rating;
                                const movie = { title, rating, user};
                                rate(movie)
                            }  
                            window.location.reload()
                        }}           
                        />
                    </Card.Content> 
                </Card>
                {this.state.showMovieDetails ?
                    <MovieDetails id={this.props.movie.id} close={this.toggleMovieDetails.bind(this)}/>
                    : null
                    }
            </div>
            
            
        )
    }
}


// PropTypes
MovieModule.propTypes = {
    movie: PropTypes.object.isRequired
}

export default MovieModule;