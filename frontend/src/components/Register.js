import React, { Component } from 'react'
import { register } from './UserFunctions'

class Register extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            email: '',
            password: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit(e) {
        e.preventDefault()

        const newUser = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }

        register(newUser).then(res => {
            if (typeof res === 'object') { 
                this.props.history.push(`/login`)
            }
            else{
                localStorage.clear()
                window.location.reload()   
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto shadow-lg p-4 mb-4 bg-white rounded-lg">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 id="title">Register</h1>
                            <div className="form-group p-2">
                                <input
                                    type="text"
                                    className="form-control p-4 border-dark"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={this.state.username}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group p-2">
                                <input
                                    type="email"
                                    className="form-control p-4 border-dark"
                                    name="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group p-2">
                                <input
                                    type="password"
                                    className="form-control p-4 border-dark"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-lg btn-dark fas fa-user-plus f3 w-20 p-3"
                            >

            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register
