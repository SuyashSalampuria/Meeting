import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import Meet from './containers/schedule'
import {PostData} from './services/PostData'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      
      username: '',
      user:null,
      allUsers:null,
      oldUser:false,
    };
    this.signup=this.signup.bind(this);
  }
  signup(res, type){
    let postData;
    if(res.w3.U3){
      var name1= res.w3.U3;
      var x=name1.search('@');
      name1=name1.slice(0,x)
      postData = {
        username: name1,
        password: res.googleId,
        token: res.Zi.access_token,
        provider_id: res.El,

      };
    }
    if (postData) {
      axios.get('http://127.0.0.1:8000/meeting/users/?format=json')
      .then(response => {
         
            this.setState({allUsers: response.data});
            let i=0;
            
          for(i=0;i<response.data.length;i++){
              if(this.state.allUsers[i].username===postData.username){
                this.setState({oldUser: true});
                break;
              }
          }
          
          if(this.state.oldUser){
          fetch('http://127.0.0.1:8000/token-auth/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
          })
            .then(res => res.json())
            .then(json => {
              localStorage.setItem('token', json.token);
              this.setState({
                logged_in: true,
                displayed_form: '',
                username: json.user.username,
                user: json.user,
              });
              
      
            });
          }
          else{
      PostData('signup', postData).then((result) => {
         let responseJson = result;
         
         this.setState({
          logged_in: true,
          displayed_form: '',
          username: responseJson.username,
          user: responseJson,
        });
         
         //this.setState({logged_in: true});
         
      });
    }
    })
    } else {}
    
      }
  

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://127.0.0.1:8000/meeting/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username, user: json });
         
        });
    }
  }
  
  responseGoogle =(response) => {
   
    this.signup(response,'google')
    
      }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          user: json.user,
        });
       

      });
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/meeting/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          user: json.user,
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '', user:null });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }
    
    return (
      <Router>
      <div className="App">
       
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
          success={this.responseGoogle}
          failure={this.responseGoogle}
          user={this.state.username}
        />
        
        {form}
        <div>
          {(this.state.logged_in && this.state.username)
            ?<div>
                <Meet user={this.state.user} />
            </div>
            : 'Please Log In'}
        </div>
       
      </div>
  </Router>
    );
  }}


export default App;