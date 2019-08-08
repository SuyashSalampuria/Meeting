import React,{Component} from 'react';
import { Card } from 'semantic-ui-react'

class Meeting extends Component {
    render(){
         var d = new Date(this.props.meet_time);
         var d1= d.toString();
         var hovering={
             cursor: 'pointer'
         }
        return (
            <div onClick={this.props.click} style={hovering}>
                <Card color='orange'>
                    
                    <Card.Content>
                        <Card.Header>{this.props.purpose}</Card.Header>
                        <Card.Meta>at {this.props.venue}</Card.Meta>
                        <Card.Description>
                            {d1}
                        </Card.Description>
                    </Card.Content>
                </Card>
                <br></br>
            </div>
        )
    }
}
export default Meeting;



