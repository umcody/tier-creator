import React from "react";
import RateStars from "../RateStars";
import RateStarsTest from "../RateStarsTest";
import Popup from "reactjs-popup";
import Login from "../../Login.js";

import "./rateAction.css";

class RateActionDiningHall extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            body: {
            },
            overall: 0,
            noise: 0,
            space: 0,
            accessibility:0,
            resource:0,
            title:"",
            review: "",
            name: "",
            loginPopup: false,
            showAlert:"none",
        }
        this.changeOverall = this.changeOverall.bind(this);
        this.changeNoise = this.changeNoise.bind(this);
        this.changeSpace = this.changeSpace.bind(this);
        this.changeAccessibility = this.changeAccessibility.bind(this);
        this.changeResource = this.changeResource.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTextArea = this.handleTextArea.bind(this);
        this.handleName = this.handleName.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }

    openPopup() {
        this.setState({ loginPopup: true });
    }
    closePopup() {
        this.setState({ loginPopup: false });
    }

    // Functions to change the state of each criterions according to the user
    changeOverall(number) {
        this.setState({ overall: number });
    }
    changeNoise(number) {
        this.setState({ noise: number });
    }
    changeSpace(number) {
        this.setState({ space: number });
    }
    changeAccessibility(number) {
        this.setState({ accessibility: number });
        console.log(this.state);
    }
    changeResource(number) {
        this.setState({ resource: number });
        console.log(this.state);
    }
    //

    handleSubmit(event) {
        // CONDITIONS BEFORE SUBMITN THE REVIEW
        if (this.state.overall === 0) {
            this.setState({showAlert:" "})
        } else if (this.state.space === 0) {
            this.setState({showAlert:" "})
        } else if (this.state.friendliness === 0) {
            this.setState({showAlert:" "})
        } else {
            fetch("/api/rate/library/" + this.state.body.category + "/" + this.state.body.name, {
                method: "post",
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(this.state)
            })
        }

    }

    handleTextArea(event) {
        this.setState({ review: event.target.value })
        console.log(this.state.review);
    }

    handleName(event) {
        this.setState({ name: event.target.value })
        console.log(this.state.name);
    }

    async componentDidMount() {
        /// CHECK IF USER IS LOGGED IN
        const JWToken = localStorage.getItem("JWT");
        if (JWToken !== null) {

            const response = await fetch("/findUser", {
                headers: { Authorization: `JWT ${JWToken}` }
            });
            const content = await response.json();
            if (content == false) {
                this.openPopup();
            }
        } else {
            this.openPopup();
        }

        // FETCH NECESSARY DATA FOR THE RATING CRITEREONS
        const { match: { params } } = this.props;
        const title = params.title;
        const item = params.item;

        this.setState({title:item});

        const data = await fetch("/api/detailed/" + title + "/" + item);
        const json = await data.json();
        this.setState({
            body: json
        })
        console.log("HEY!");
        console.log(this.state.body);
        console.log(this.state);
    }

    render() {
        return (
            <div className="rateFormContainer">
                <Popup
                    open={this.state.loginPopup}
                    closeOnDocumentClick
                    onClose={this.closePopup}>
                    <Login />
                </Popup>
                <div id="title">Rate For {this.state.title}</div>
                <form>
                    <div id="rateForm">
                        <table>
                            <tr>
                                <th>Overall</th>

                                <th><RateStars name="overall" whenClicked={this.changeOverall} /></th>
                            </tr>
                            <tr>
                                <th>Noise</th>
                                <th><RateStars name="noise" whenClicked={this.changeNoise} /></th>
                            </tr>
                            <tr>
                                <th>Space</th>
                                <th><RateStars name="space" whenClicked={this.changeSpace} /></th>
                            </tr>
                            <tr>
                                <th>Accessibility</th>
                                <th><RateStars name="accessibility" whenClicked={this.changeAccessibility} /></th>
                            </tr>
                            <tr>
                                <th>Resource</th>
                                <th><RateStars name="resource" whenClicked={this.changeResource} /></th>
                            </tr>
                        </table>
                    </div>

                    <div id="writingAreaContainer">
                        <input placeholder="Name (OPTIONAL)" onChange={this.handleName}></input>
                        <textarea type="text" id="writingArea" onChange={this.handleTextArea} placeholder="Write Your Review Here (OPTIONAL)"></textarea>
                    </div>

                    <btn className="submitBtn" onClick={this.handleSubmit}> Submit </btn>
                    <div style = {{display:this.state.showAlert}}>You must rate on all criterions!</div>
                </form>
            </div>
        )
    }
}

export default RateActionDiningHall;