import React,{Component} from 'react';
import Meeting from '../components/Meeting/Meeting';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import MeetDetail from '../components/DetailMeet/DetailMeet';
import NewMeeting from '../components/NewMeet/NewMeet';
import 'semantic-ui-css/semantic.min.css'
import Update from '../components/Update/Update'
//import UpdateMeet from '../components/Update/Update';
class Schedule extends Component{
    state={
        meetings:null,
        selectedMeetingId: null,
        isOwner: false
    }
    componentDidMount(){
        fetch('http://127.0.0.1:8000/meeting/all/?format=json')
        .then(res => res.json())
        .then((response) => {
            
            var meet1 = response;
           

            this.setState({meetings: meet1});
            
        });
    }
    meetingSelectHandler = (id, isOwner)=>{
        this.setState({selectedMeetingId:id});
        this.setState({isOwner:isOwner});
    }
    allowed =(obj)=>{
        
        if(this.props.user.is_staff || (obj.owner===this.props.user))
            return true;

        if(!obj.private) return true;
        
        for(var i=0;i<obj.participants.length;i++){
           
            if (obj.participants[i]===this.props.user.id)
                    return true;}
        return false;
    }
    
    render (){
        var meetings1=null
        if(this.state.meetings){
        meetings1 = this.state.meetings.map(meeting =>{
            if(this.allowed(meeting)){
            return <Meeting
            key ={meeting.id} 
            purpose={meeting.purpose} 
            venue={meeting.venue}
            meet_time={meeting.meet_time}
            click = {this.meetingSelectHandler.bind(this, meeting.id,meeting.owner===this.props.user.id )}  />
            }
            return null;
        })}
        return (
            <div>
                <div>
                <div class="ui huge header">Meetings</div>
                {/* {meetings1} */}
                </div>
                <div>
                    <MeetDetail id={this.state.selectedMeetingId} user={this.props.user} isOwner={this.state.isOwner}/>
                </div>
                <Switch>
        <Route path="/" exact render={() => <div>
                {meetings1}
                </div>} />
        <Route path="/meeting/details" exact render={() => <div><MeetDetail id={this.state.selectedMeetingId} /></div>} />
        <Route path="/meeting/new" exact component={NewMeeting } />
        <Route path="/meeting/update" exact component={Update} />
        </Switch>
            </div>

        )
    }
}
export default Schedule;