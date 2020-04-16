import React, { Component } from 'react'
import { login } from './UserFunctions'

class Login extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            error: {}
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }
    onSubmit(e) {
        e.preventDefault()

        const user = {
            username: this.state.username,
            password: this.state.password
        }

        login(user).then(res => {
            // check if res is error
            if(this.state.username === '' || this.state.password === ''){
                window.alert("Please fill all the fields!")
            }else if (typeof res === 'object') { 
                window.alert("Account not found! Please try again")
                localStorage.clear()
                window.location.reload()
            }else {
                this.props.history.push(`/profile`)
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto shadow-lg p-4 mb-4 bg-white rounded-lg">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 id="title">Log in</h1>
                            <div className="form-group p-2">
                                <input
                                    type="text"
                                    className="form-control p-4 border-dark bg-white"
                                    name="username"
                                    placeholder="Enter username"
                                    value={this.state.username}
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
                                className="btn btn-lg btn-dark fas fa-sign-in-alt f3 w-20 p-3"
                            >

            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
