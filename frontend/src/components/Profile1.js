import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import RatedMovies from './rated_movies'

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            email: '',
            errors: {}
        }
    }

    componentDidMount() {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        this.setState({
            username: decoded.identity.username,
            email: decoded.identity.email
        })
    }

    render() {
        return (
            <div className='.f2 tc pa4'>
                <div className="container">
                    <div className="jumbotron mt-5">
                        <div className="col-sm-8 mx-auto">
                            <h1 id="title" className="text-center">Profile</h1>
                        </div>
                        <table className="table col-md-6 mx-auto">
                            <tbody>
                                <tr>
                                    <td className="badge badge-dark text-white col-8">Username</td>
                                    <td>{this.state.username}</td>
                                </tr>
                                <tr>
                                    <td className="badge badge-dark text-white col-8">Email</td>
                                    <td>{this.state.email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <RatedMovies />
            </div>
        )
    }
}

export default Profile1