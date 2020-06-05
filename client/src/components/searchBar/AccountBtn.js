import React from "react";

class AccountBtn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            username: ""
        }
    }



    async componentDidMount() {
        const JWToken = localStorage.getItem("JWT");
        if (JWToken !== null) {
            console.log("NOTNULL");

            const response = await fetch("/findUser", {
                headers: { Authorization: `JWT ${JWToken}` }
            });

            const content = await response.json();
            this.setState({
                username: content.username
            });
        }

    }



    render() {

        if (this.state.username === "") {
            return (
                <div className="accountBtn">
                    <a href="/registerUser"> Log In / Sign Up</a>
                </div>
            );
        } else {
            return (
                <div className="accountBtn">
                    <div style = {{display: "inline-block"}}>{`It's time to Rank, `}</div>
                    <div className = "username"> {` @${this.state.username}`}</div>
                </div>
            );
        }
    }


}
export default AccountBtn;