import React from "react";
import { Route } from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            data: {},
            showAlert: "none",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.placeholder]: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const data = await fetch("/login", { // FETCH TO LOGIN
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        });
        const temp = await data.json();
        if (temp.auth === false) { // IF INVALID INPUT, LOG. *** NEED TO PERFORM AN ACTION TO LET THE USER KNOW OF THE INVALID INPUT**
            this.setState({ showAlert: " " });
        } else {
            localStorage.setItem("JWT", temp.token);
            window.location.href = ("/");
        }

    }


    render() {
        return (
            <div>
                <form className="authForm" onSubmit={this.handleSubmit}>
                    <img src="../asset/temp_logo.png" />
                    <input id="email" placeholder="email" onChange={this.handleChange} type="email"></input>
                    <input placeholder="password" onChange={this.handleChange}></input>
                    <div class="alertText" style={{ display: this.state.showAlert }}>Login Failed. The account either does not exist or your password is incorrect</div>
                    <button type="submit">Let's Rank!</button>
                    <a className="redirect" href="/registerUser"> Don't have an Account? Click here</a>
                </form>
            </div>
        )
    }
}
export default Login;