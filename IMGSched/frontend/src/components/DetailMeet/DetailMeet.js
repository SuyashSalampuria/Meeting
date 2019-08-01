import React, { Component } from 'react';
import axios from 'axios';
import UpdateMeet from '../Update/Update';
import 'semantic-ui-css/semantic.min.css'
class FullPost extends Component {
    
    state = {
        loadedPost : null,
        comments: null,
        allUsers: null,
        chatSocket:new WebSocket('ws://127.0.0.1:8000/ws/chat/'+this.props.id + '/'),
    }
    componentDidUpdate (){
        console.log("another page "+this.props.id)
        if(this.props.id){
            if((!this.state.loadedPost) || (this.state.loadedPost && (this.state.loadedPost.id !== this.props.id))){
        axios.get('http://127.0.0.1:8000/meeting/'+this.props.id+'/?format=json')
        .then(response => {
            console.log("yahan bhi pahuch gyw")
            this.setState({loadedPost: response.data});
            
        })
    }}
    if(this.props.id){
        if((!this.state.loadedPost) || (this.state.loadedPost && (this.state.loadedPost.id !== this.props.id))){
    axios.get('http://127.0.0.1:8000/meeting/comments/all',
    {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('token')}`,
        }
        })
    .then(response => {
        console.log("comments wala function")
        console.log(response)
        this.setState({comments: response.data});
           })
}}
if(this.props.id){
    if((!this.state.loadedPost) || (this.state.loadedPost && (this.state.loadedPost.id !== this.props.id))){
axios.get('http://127.0.0.1:8000/meeting/users/?format=json')
.then(response => {
    console.log(response)
    this.setState({allUsers: response.data});
    
})
}}    
}
deleteMeeting = ()=>{
    fetch('http://127.0.0.1:8000/meeting/'+this.props.id+'/?format=json',{
        method:'DELETE',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('token')}`,
        }
        }).then(response => {
        console.log("DElete data")
        console.log(response);
    })
}
componentWillMount(){
    this.state.chatSocket.onmessage=(e)=>{
        console.log("messagee recieved")
        var data = JSON.parse(e.data);
        var message = data['message'];
        document.querySelector('#chat-log').value += (message + '\n');
    }
}

     
    
   messageSend=(e)=>{
        var messageInputDom = document.querySelector('#chat-message-input');
        var message = messageInputDom.value;
        console.log(message)
        message= this.props.user.id +' '+this.props.id+' '+ message;
        this.state.chatSocket.send(JSON.stringify({
            'message': message
        }));

        messageInputDom.value = '';
    }
    keyUp=(e) =>{
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }

    }
    invitePerson=(id) =>{
        console.log("invite function called")
        const url='http://127.0.0.1:8000/meeting/'+id+'/?format=json'
        const data=this.state.loadedPost;
        data.participants.push(id)
        this.setState({loadedPost: data});
            
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
    checkInvite=(id) =>{
        if(this.state.loadedPost.owner==id) return false;
        var x=this.state.loadedPost.participants
        console.log("checking invite")
        console.log(x)
        for(var i=0;i<x.length;i++){
            if(id===x[i])
                return false;
        }
        return true;
    }

    render () {        
        let com= null;
        let comForm=null;
        let invitees=null;
        let meet = <p style={{textAlign: 'center'}}>Please select a Meeting!</p>;
        if(this.state.loadedPost){
        meet = (
            <div>
                <h1>{this.state.loadedPost.purpose} </h1>
                <p>at {this.state.loadedPost.venue}</p>
                <p>at {this.state.loadedPost.meet_time}</p>
                
                <div>
                    <button className="Delete" onClick={this.deleteMeeting}>Delete</button>
                    <button className="Update">Update</button>
                </div>

                <div>
                    <UpdateMeet id={this.props.id} meet={this.state.loadedPost} user={this.props.user} isOwner={this.props.isOwner} />
                </div>
            </div>
        
        );
        
    }
        
                if(this.state.loadedPost){
                    if(this.state.comments){
                com = this.state.comments.map(comment =>{
                    if( comment.meeting===this.props.id){
                        var index=comment.user;
                        console.log(index)
                    return <div>
                         {this.state.allUsers[index-1].username} - {comment.Comment}

                
                    
                    </div>}
                    return null;
                    
                })}
                comForm=<div>
                        <form>
                    <textarea id="chat-log" cols="100" rows="20"></textarea><br/>
                    
                    <input id="chat-message-input" type="text" size="100" onKeyUp={this.keyUp}/><br/>
                    <input id="chat-message-submit" type="button" value="Send" onClick={this.messageSend} />
                    </form>
                </div>
                if(this.state.allUsers){
                invitees = this.state.allUsers.map(user1 =>{
                    if(this.checkInvite.bind(this,user1.id)){
                                               
                    return <div id={user1.id} onClick={this.invitePerson.bind(this, user1.id)}>
                         {user1.username} 

                
                    
                    </div>}
                    return null;
                    
                })}
            }
        
        return (
            <div>
                <div>
                {meet}
            
                </div>
                <div>
                {invitees}
            
                </div>
                <div>
                    {com}
                    {comForm}
                </div>

            </div>
        )
    }
}


export default FullPost;