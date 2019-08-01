import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import './App.css';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css'
import GoogleLogin from 'react-google-login';
//import {Redirect} from 'react-router-dom'
import Meet from './containers/schedule'
import {PostData} from './services/PostData'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      
      username: '',
      user:null,
      allUsers:null,
      oldUser:true,
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
          console.log(response)
            this.setState({allUsers: response.data});
          for(var i=0;i<response.length;i++){
              if(allUsers[i].username==postData){
                this.setState({oldUser: true});
                break;
              }
          }
          
      
      PostData('signup', postData).then((result) => {
         let responseJson = result;
         console.log(responseJson)
         this.setState({
          logged_in: true,
          displayed_form: '',
          username: responseJson.username,
          user: responseJson,
        });
         
         //this.setState({logged_in: true});
         
      });
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
          console.log("list of users");
          console.log(this.state.user)
        });
    }
  }
  
  responseGoogle =(response) => {
    console.log(response);
    console.log(response.Zi.access_token);
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
        console.log(this.state.user)

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
      <div className="App">
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        <GoogleLogin
        clientId="143741235966-g7budmcg1f2nqf56l0jnip4u26pi2u8q.apps.googleusercontent.com" 
        buttonText="LOGIN WITH GOOGLE"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
        {form}
        <div>
          {this.state.logged_in
            ?<div> Hello {this.state.username}
                <Meet user={this.state.user} />
            </div>
            : 'Please Log In'}
        </div>
            
      </div>
    );
  }}


export default App;