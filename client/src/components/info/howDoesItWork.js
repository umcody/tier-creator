import React from 'react';
import {Helmet} from 'react-helmet';
export default () => {
    return (
        <div className="onePage">
            <div className = "center" style = {{top:"30%"}}>
                <h5>How do we rank and rate the campus?</h5>
                <h5 style = {{marginTop:"20px"}}>It's simple. We just average your ratings and rankings. </h5>
            </div>
            <Helmet>
                <title>How Does It Work?</title>
                <meta name = "description" content = "How do we rank and rate the campus?"/>
            </Helmet>
        </div>
    )
}