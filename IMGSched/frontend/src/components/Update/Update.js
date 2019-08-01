import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

class NewMeet extends Component {
    state = {
        purpose: this.props.meet.purpose,
        venue: this.props.meet.venue,
        private: this.props.meet.private,
        meet_time: this.props.meet.meet_time,
        
    }
    putDataHandler = () => {
        console.log(this.state.user)
        const data={
            "purpose": this.state.purpose,
            "venue": this.state.venue,
            "private": this.state.private,
            "meet_time": this.state.meet_time,
        };
        console.log(data)
        const url='http://127.0.0.1:8000/meeting/'+this.props.id+'/?format=json'
        console.log(url)
        fetch(url,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log("PUT data")
            console.log(response);
        })
    }
    render () {
        if(this.props.isOwner || this.props.user.is_staff){
        return (
            <div className="NewPost">
                <h1>Update Meeting</h1>
                <label>Purpose</label>
                <input type="text" value={this.state.purpose} onChange={(event) => this.setState({purpose: event.target.value})} />
                <label>Venue</label>
                <input type="text" value={this.state.venue} onChange={(event) => this.setState({venue: event.target.value})} />
                <label>Meeting Time</label>
                <input type="datetime-local"  onChange={(event) => this.setState({meet_time: event.target.value})} />
                    
                <button onClick={this.putDataHandler}>Update Meeting</button>
                <BrowserRouter>
                <Switch>
        
        
        </Switch>
        </BrowserRouter>
            </div>
        );}
        else
        return null;
    }
}

export default NewMeet;