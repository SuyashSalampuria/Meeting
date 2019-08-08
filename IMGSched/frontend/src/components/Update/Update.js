import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Input,Button } from 'semantic-ui-react'

class NewMeet extends Component {
    state = {
        purpose: this.props.meet.purpose,
        venue: this.props.meet.venue,
        private: this.props.meet.private,
        meet_time: this.props.meet.meet_time,
        
    }
    putDataHandler = () => {
        
        const data={
            "purpose": this.state.purpose,
            "venue": this.state.venue,
            "private": this.state.private,
            "meet_time": this.state.meet_time,
        };
        
        const url='http://127.0.0.1:8000/meeting/'+this.props.id+'/?format=json'
       if(data){
        fetch(url,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data)
        }).then(response => {
           
        })
    }}
    render () {
        if(this.props.isOwner || this.props.user.is_staff){
        return (
            <div className="NewPost">
                <h1>Update Meeting</h1>
                
                <div class="ui labeled input">
                <div class="ui label label">Purpose</div>
                <div class="ui focus input"><input type="text" value={this.state.purpose} onChange={(event) => this.setState({purpose: event.target.value})} required /></div>
                </div><br></br>
                <div class="ui labeled input">
                <div class="ui label label">Venue</div>
                <div class="ui focus input"><input type="text" value={this.state.venue} onChange={(event) => this.setState({venue: event.target.value})} required /></div>
                </div><br></br>
                <div class="ui labeled input">
                <div class="ui label label">Meeting Time</div>
                <div class="ui focus input"><input type="datetime-local"  onChange={(event) => this.setState({meet_time: event.target.value})} required /></div>
                </div><br></br>
                <Button basic color='green' onClick={this.putDataHandler}>Update Meeting</Button>
            </div>
        );}
        else
        return null;
    }
}

export default NewMeet;