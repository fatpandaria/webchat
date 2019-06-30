import React from 'react';
import { Layout, Button ,Tooltip, Progress, Input} from 'antd';
import classNames from 'classnames';
import styles from './webChat.module.scss';
const cx = classNames.bind(styles);
const { Header } = Layout;
class WebChatComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            friendId:''
        }
        this.handleInput = this.handleInput.bind(this);
    }
    async componentDidMount() {
        // run once after the vdom mounted to dom
    }
    handleInput(e){
        this.setState({friendId: e.target.value});
    }
    render() {
        return (
            <div className={styles.webChatWrapper}>
                <div className={cx({ [styles.leftNav]: true })}>
                    {this.props.peer ? <Tooltip placement="bottomRight" title="Click it will disconnect to PeerServer and your friend will be unable to find you">
                    <Button type="danger" onClick={this.props.disconnectToPeerServer}>GoOffline</Button>
                    </Tooltip>
                    : <Tooltip placement="bottomRight" title="Click it will generate an unique Id for you,with which your friend can find your.">
                    <Button type="primary" onClick={this.props.connectToPeerServer}>GoOnline</Button>
                    </Tooltip>}
                </div>
                <div className={cx({ [styles.middleList]: true })}>
                    <div className={styles.friendItem}>
                    <span>Your Unique Id:</span><span>{this.props.uniqueId}</span>
                    </div>
                    <div className={styles.startChat}>
                        <p>Enter your friend's uniqueid and start chat</p>
                        <Input onChange={this.handleInput} size="small" placeholder="friend's uniqueid"></Input>
                        <Button onClick={(e)=>this.props.startVideoChat(this.state.friendId)}>Start Video Chat</Button>
                    </div>
                </div>
                <div className={cx({ [styles.rightChat]: true })}>
                    <div className={styles.videoWrapper}>
                        <div className={styles.yourVideoWrapper} >
                            <div id="yourVideoWrapper"></div>
                            <span>SoundLevel</span>
                            <Progress showInfo={false} percent={parseInt(this.props.soundLevel*100,10)}></Progress>
                        </div>
                        <div className={styles.peerVideoWrapper} id="peerVideoWrapper"></div>
                    </div>

                    <div className={styles.inputWrapper}></div>
                </div>
                {/* <div>
                    {this.props.title}
                </div>
                <div id="videoWrapper"></div>
                <div id="downloadWrapper"></div>
                <p>{this.props.soundLevel}</p>
                <Button onClick={this.props.recordVideo}>Record Video</Button> */}
            </div>
        )
    }
}

export default WebChatComponent;