import React, {Component, ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from 'react-google-calendar-api';
import 'semantic-ui-css/semantic.min.css'
class NewMeet extends Component {
    state = {
        purpose: '',
        venue: '',
        private: false,
        meet_time: null,
    }
    
    postDataHandler = () => {
        console.log(this.state.user)
        const data={
            purpose: this.state.purpose,
            venue: this.state.venue,
            private: this.state.private,
            meet_time: this.state.meet_time,
        };
         let eventFromNow = null;
        console.log(data)
        var isRaised= false;
        var promise = new Promise(function(resolve, reject) {
            try {
                var ft=ApiCalendar.handleAuthClick()
                console.log("try block")
                if (ft){
                    resolve()
                }
            }
            catch (e) {
                isRaised=true;
                reject(e)
            }
            
        });
        ApiCalendar.handleAuthClick().then(()=>{
            console.log("event in creation")
         eventFromNow = {
          'summary': data.purpose,
          'location': data.venue,
          'start': {
            'dateTime': data.meet_time,
            'timeZone': 'Asia/Kolkata',
            
          },
          'end': {
            'dateTime': data.meet_time,
            'timeZone': 'Asia/Kolkata',
            
          },
      };
     
        ApiCalendar.createEvent(eventFromNow)
        .then((result) => {
            console.log("added event to calendar")
      console.log(result);
        })
     .catch((error) => {
         console.log("failed to add event to google calendar")
       console.log(error);
        });
    } )
        fetch('http://127.0.0.1:8000/meeting/all/',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log("POsted data")
            console.log(response);
        })
    }

    render () {
        
        return (
            <div>
            <div className="container">
         </div>
            <div className="NewPost">
                <h1>Add a Meeting</h1>
                <label>Purpose</label>
                <input type="text" value={this.state.purpose} onChange={(event) => this.setState({purpose: event.target.value})} />
                <label>Venue</label>
                <input type="text" value={this.state.venue} onChange={(event) => this.setState({venue: event.target.value})} />
                <label>Meeting Time</label>
                <input type="datetime-local" value={this.state.meet_time} onChange={(event) => this.setState({meet_time: event.target.value})} />
                <label>Private</label>
                <input type="checkbox" value={this.state.private} onChange={(event) => this.setState({private: event.target.value})} />    
                <button onClick={this.postDataHandler}>Add Meeting</button>
            </div>
            </div>
        );
    }
}

export default NewMeet;