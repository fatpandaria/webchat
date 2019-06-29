import React from 'react';
import {Layout, Button} from 'antd';
// import classNames from 'classnames';
// import styles from './webChat.module.scss';
// const cx = classNames.bind(styles);
const {Header} = Layout;
class WebChatComponent extends React.Component{
    // constructor(props){
    //     super(props);
    // }
    async componentDidMount(){
        // run once after the vdom mounted to dom
    }
    render(){
        return (
            <div>
                <Header></Header>
                <div>
                    {this.props.title}
                </div>
                <div id="videoWrapper"></div>
                <div id="downloadWrapper"></div>
                <p>{this.props.soundLevel}</p>
                <Button onClick={this.props.recordVideo}>Record Video</Button>
            </div>
        )
    }
}

export default WebChatComponent;