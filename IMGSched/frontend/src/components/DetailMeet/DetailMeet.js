import React, { Component } from 'react';
import axios from 'axios';
import UpdateMeet from '../Update/Update';
import { Card, Icon, Button } from 'semantic-ui-react'
class FullPost extends Component {

    state = {
        loadedPost: null,
        comments: null,
        allUsers: null,
        chatSocket: new WebSocket('ws://127.0.0.1:8000/ws/chat/' + this.props.id + '/'),
    }
    componentDidUpdate() {
        if (this.props.id) {
            if ((!this.state.loadedPost) || (this.state.loadedPost && (this.state.loadedPost.id !== this.props.id))) {
                axios.get('http://127.0.0.1:8000/meeting/' + this.props.id + '/?format=json')
                    .then(response => {
                        
                        this.setState({ loadedPost: response.data });

                    })
            }
        }
        if (this.props.id) {
            if ((!this.state.loadedPost) || (this.state.loadedPost && (this.state.loadedPost.id !== this.props.id))) {
                axios.get('http://127.0.0.1:8000/meeting/comments/all',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `JWT ${localStorage.getItem('token')}`,
                        }
                    })
                    .then(response => {
                       
                        this.setState({ comments: response.data });
                    })
            }
        }
        if (this.props.id) {
            if ((!this.state.loadedPost) || (this.state.loadedPost && (this.state.loadedPost.id !== this.props.id))) {
                axios.get('http://127.0.0.1:8000/meeting/users/?format=json')
                    .then(response => {
                        
                        this.setState({ allUsers: response.data });

                    })
            }
        }
    }
    deleteMeeting = () => {
        fetch('http://127.0.0.1:8000/meeting/' + this.props.id + '/?format=json', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('token')}`,
            }
        }).then(response => {
            
            console.log(response);
        })
    }
    componentWillMount() {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.chatSocket.onmessage = (e) => {
          
            var data = JSON.parse(e.data);
            var message = data['message'];
            document.querySelector('#chat-log').value += (message + '\n');
        }
        if (this.props.id) {
            if ((!this.state.loadedPost) || (this.state.loadedPost && (this.state.loadedPost.id !== this.props.id))) {
                axios.get('http://127.0.0.1:8000/meeting/users/?format=json')
                    .then(response => {
                       
                        this.setState({ allUsers: response.data });

                    })
            }
        }
    }



    messageSend = (e) => {
        var messageInputDom = document.querySelector('#chat-message-input');
        var message = messageInputDom.value;
      
        message = this.props.user.id + ' ' + this.props.id + ' ' + message;
        this.state.chatSocket.send(JSON.stringify({
            'message': message
        }));

        messageInputDom.value = '';
    }
    keyUp = (e) => {
        if (e.keyCode === 13) {  // enter, return
            document.querySelector('#chat-message-submit').click();
        }

    }
    invitePerson = (id) => {
        console.log("invite function called")
        const url = 'http://127.0.0.1:8000/meeting/' + id + '/?format=json'
        const data = this.state.loadedPost;
        data.participants.push(id)
        this.setState({ loadedPost: data });

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log("PUT data")
            console.log(response);
        })
    }
    checkInvite = (id) => {
        console.log("checking invite")
        console.log(this.state.loadedPost)
        if (this.state.loadedPost.owner === id) return false;
        var x = this.state.loadedPost.participants
        console.log(x)
        for (var i = 0; i < x.length; i++) {
            if (id === x[i])
                return false;
        }
        return true;
    }

    render() {
        let com = null;
        let comForm = null;
        let invitees = null;
        let meet = <p style={{ textAlign: 'center' }}>Please select a Meeting!</p>;
        if (this.state.loadedPost) {
            var d = new Date(this.state.loadedPost.meet_time);
            var d1 = d.toString();
            var d2 = new Date(this.state.loadedPost.time_created);
            var d3 = d2.toString();
            var index = this.state.loadedPost.owner;
            let usercreator=null
            if(this.state.allUsers){
            usercreator = this.state.allUsers[index - 1].username
            meet = (
                <div>
                    <Card color='green'>

                        <Card.Content>
                            <Card.Header>{this.state.loadedPost.purpose}</Card.Header>
                            <Card.Meta>at {this.state.loadedPost.venue}</Card.Meta>
                            <Card.Description>
                                {d1}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' >
                                    Update
          </Button>
                                <Button basic color='red' onClick={this.deleteMeeting}>
                                    Delete
          </Button>
                            </div>
                            <Icon name='user' />
                            {usercreator}
                            <div>
                                <Icon name='bell outline' />
                                {d3}
                            </div>
                        </Card.Content>
                    </Card>



                    <div>
                        <UpdateMeet id={this.props.id} meet={this.state.loadedPost} user={this.props.user} isOwner={this.props.isOwner} />
                    </div>

                </div>
            )}

        }

        if (this.state.loadedPost) {
            if (this.state.comments && this.state.allUsers) {
                com = this.state.comments.map(comment => {
                    if (comment.meeting === this.props.id) {
                        var index = comment.user;
                        
                        return <div>
                            {this.state.allUsers[index - 1].username} - {comment.Comment}



                        </div>
                    }
                    return null;

                })
            }
            comForm = <div>
                <form>
                    <textarea id="chat-log" cols="100" rows="5"></textarea><br />

                    <input id="chat-message-input" type="text" size="100" onKeyUp={this.keyUp} /><br />
                    <input id="chat-message-submit" type="button" value="Send" onClick={this.messageSend} />
                </form>
            </div>
            if (this.state.allUsers) {
                let parentThis = this
                invitees = this.state.allUsers.map(user1 => {
                    let y = user1.id;
                    let x = parentThis.checkInvite(y);
                    if (x) {

                        return <div id={user1.id} onClick={parentThis.invitePerson(user1.id)}>
                            {user1.username}



                        </div>
                    }
                    return null;

                })
            }
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