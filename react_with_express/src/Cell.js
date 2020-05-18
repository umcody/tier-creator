import React from "react";
import ReactDOM from "react-dom";
import posed from "react-pose";
//import image from "../public/asset/kobeBryant.jpg";


// VOTE ANIMATION USING POSE JS
const Vote = posed.div({
    hidden: { left: "0px" },
    visible: {
        left: "-75px",
        transition: {
            width: { ease: "easeInAndOut", duration: 200 }
        }
    }
});

class Cell extends React.Component {

    // CONSTRUCTOR and Initializes the STATE.
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            count: this.props[0].count,
            clicked: false,
            clickCount:0,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    // vote CLICKED HANDLER to Toggle animation 
    handleClick(event) {
        
        if(this.state.clickCount === 0){
            this.setState({
                isVisible: !this.state.isVisible,
                clickCount: 1
            });
        }else if(this.state.clickCount === 1){
            this.setState({
                isVisible1: !this.state.isVisible1,
                clickCount: 2
            });
        }else{
            this.setState({
                isVisible: false,
                isVisible1: false,
                clickCount: 0
            });
        }
        
    }

    // POSTS to Server that the item is voted
    componentDidMount() {
        const current = ReactDOM.findDOMNode(this);
        let button = current.querySelector(".upVote");
        let player = this.props[0].name;
        console.log(player);
        button.addEventListener("click", (e) => {
            if (this.state.clicked === false) {
                console.log("SENDING POST TO "+ player)
                fetch("ranked/nba/upvote/" + player, {
                    method: "post",
                    body: {
                        "name": player
                    }
                });
                this.setState({ count: this.state.count + 1, clicked: true });
            }else{
                console.log("SENDING POST TO "+ player)
                fetch("ranked/nba/downvote/" + player, {
                    method: "post",
                    body: {
                        "name": player
                    }
                });
                this.setState({ count: this.state.count -1, clicked: false});
            }
        })
    }

    //RENDER the Row
    render() {
        const { isVisible } = this.state;
        const { isVisible1 } = this.state;
        return (

            <tr className="row">
                <th className="voteContainer">
                    <Vote className="vote1" pose={isVisible ? "visible" : "hidden"}></Vote>
                    <Vote className="vote2" pose={isVisible1 ? "visible" : "hidden"}></Vote>
                    <Vote className="vote3" pose={isVisible ? "visible" : "hidden"}></Vote>
                </th>
                <th>{this.props[1]}</th>
                <th>
                    <div className="image_border">
                        <img src={this.props[0].image} className="profile_pic" alt="" >
                        </img>
                        <div className="medal"></div>
                    </div></th>
                <th><div className="name">{this.props[0].name}</div></th>
                <th>
                    <a className="upVote" onClick={this.handleClick}>
                        <img src="/asset/vote_btn.svg" className = "voteSVG"></img>
                    </a>
                </th>
                <th className="count">{this.state.count}</th>
            </tr>
        );
    }
}

export default Cell;