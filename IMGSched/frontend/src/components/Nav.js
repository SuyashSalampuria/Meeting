import React from 'react';
import { BrowserRouter as  Link } from "react-router-dom";

import PropTypes from 'prop-types';
import { Input, Menu } from 'semantic-ui-react'
import GoogleLogin from 'react-google-login';
function Nav(props) {
  const userName="Hello "+props.user;
  const logged_out_nav = (
    <div>

    <Menu secondary>
    <Menu.Item
      name='login'
      onClick={() => props.display_form('login')}
      // active={activeItem === 'meetings'}
      
    />
    <Menu.Item
      name='sign up'
      onClick={() => props.display_form('signup')}
      // active={activeItem === 'new meetings'}
      
    />
    
      <Menu.Item>
      <GoogleLogin
        clientId="143741235966-g7budmcg1f2nqf56l0jnip4u26pi2u8q.apps.googleusercontent.com" 
        buttonText="LOGIN WITH GOOGLE"
        onSuccess={props.success}
        onFailure={props.failure}
      />
      </Menu.Item>
        
      
 
  </Menu>
  </div>    
  );

  const logged_in_nav = (
    <Menu secondary>
    <Link to="/"><Menu.Item
      name='Meetings'
      // active={activeItem === 'meetings'}
      
    /></Link>
   
    <Link to="/meeting/new"><Menu.Item
      name='new meeting'
      // active={activeItem === 'new meetings'}
      
    /></Link>
   
    <Menu.Menu position='right'>
    <Menu.Item name={userName} />
      <Menu.Item
        name='logout'
        // active={activeItem === 'logout'}
        onClick={props.handle_logout}
      />
    </Menu.Menu>
  </Menu>
  );
  return <div>{(props.logged_in && props.user )? logged_in_nav : logged_out_nav}</div>;
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};