import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Icon, Form } from 'semantic-ui-react'

class Landing extends Component {
    constructor() {
        super()
        this.state = {
            query: '',
        }
    }

    logOut(e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
        window.location.reload()
    }

    handleInputChange(e, data) {
        this.setState({
            query: data.value
        })
    }

    search(e, data) {
        
        e.preventDefault()
        if (this.state.query.length > 0) {
            localStorage.setItem('query', this.state.query) 
            this.props.history.push("/search")
            window.location.reload()
        }
    }

    render() {
        const loginRegLink = (
            <ul className="nav navbar-nav navbar-right">
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        <i className="fas fa-sign-in-alt f3 pa2"></i> Login
        </Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link">
                        <i className="fas fa-user-plus f3 pa2"></i> Register
        </Link>
                </li>
            </ul>
        )

        const userLink = (
            <ul className="nav navbar-nav navbar-right">
                <li className="nav-item">
                    <Link to="/profile" className="nav-link">
                        <i className="far fa-user f3 pa2"></i> User
        </Link>
                </li>
                <li className="nav-item">
                    {/* eslint-disable-next-line */}
                    <a href="" onClick={this.logOut.bind(this)} className="nav-link">
                        <i className="fas fa-sign-out-alt f3 pa2"></i> Logout
        </a>
                </li>
            </ul>
        )

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
                <a className="navbar-brand" href="/"></a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target=".navbar-collapse"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="nav navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <i className="fas fa-home f3 pa2"></i> Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/browse" className="nav-link">
                                <i className="fas fa-film f3 pa2"></i> All Movies
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <Form onSubmit={this.search.bind(this)}>
                            <Form.Input 
                                icon={<Icon name='search' inverted circular link onClick={this.search.bind(this)}/>}
                                onChange={this.handleInputChange.bind(this)}
                                placeholder='Search...'
                                autoFocus
                            />
                        </Form>
                    </ul>
                    <ul className="nav navbar-nav ml-auto navbar-right">
                    </ul>
                    {typeof localStorage.usertoken === "string" && localStorage.usertoken.length !== 15 ? userLink : loginRegLink}
                </div>
            </nav>
        )
    }
}

export default withRouter(Landing)
