import React,{Component} from 'react';

class Meeting extends Component {
    render(){
         var d = new Date(this.props.meet_time);
         var d1= d.toString();
        return (
            <div onClick={this.props.click}>
                <h1>{this.props.purpose}</h1>
                 <p> at {this.props.venue}</p>
                 {d1}
            </div>
        )
    }
}
export default Meeting;