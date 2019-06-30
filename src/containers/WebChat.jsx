import React from 'react';
import { connect } from 'react-redux';
import WebChatComponent from '../components/webChat/WebChat';
import { openVideoInvitationModal, closeVideoInvitationModal, MODAL_VIDEO_CHAT_INVITATION } from '../reducers/modals';
import Peer from 'peerjs';
import Media from '../lib/Media'
import SoundMeter from '../lib/SoundMeter';
import {genRandomStr} from '../lib/uitls';
const env = process.env.NODE_ENV;
console.log(env);
class WebChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Web Chat Room',
            peer: null,
            conn: null,
            options: {
                video: true,
                audio: true,
                streamSource: 'camera'
            },
            soundLevel: 0,
            detectTimer: null,
            uniqueId: '',
            stream: null,

        }
        this.connectOther = this.connectOther.bind(this);
        this.recordVideo = this.recordVideo.bind(this);
        this.connectToPeerServer = this.connectToPeerServer.bind(this);
        this.startVideoChat = this.startVideoChat.bind(this);
        this.disconnectToPeerServer = this.disconnectToPeerServer.bind(this);
    }
    componentDidMount() {
        this.mediaHolder = new Media(this.state.options);
        this.initVideo();
        this.state.uniqueId = localStorage.getItem('uniqueid') || '';
    }
    connectOther(id) {
        let conn = this.state.peer.connect(id);
        this.setState({conn});
        conn.on('open', () => {
            conn.send('hi');
        }
        )
        
    }
    initVideo() {
        this.mediaHolder.createStream().then((stream) => {
            let video = this.mediaHolder.play('yourVideoWrapper',stream);
            this.setState({stream, video});
            video.controls = false;
            video.muted = true; // you don't need to listen to your own voice
            this.initSoundDetector(stream);
        }).catch((err) => {
            console.log(err)
        });
    }
    initSoundDetector(stream) {
        if (this.detectTimer) { // clear timer anyway
            clearInterval(this.detectTimer);
            this.detectTimer = null;
        }
        let MyAudioContext;
        let myAudioContext;
        try {
            MyAudioContext = window.AudioContext || window.webkitAudioContext;
            myAudioContext = new MyAudioContext();
        } catch (e) {
            console.error('Web Audio API not supported.');
        }
        const soundMeter = new SoundMeter(myAudioContext);
        soundMeter.connectToSource(stream, (e) => {
            if (e) {
                console.log(e);
            } else {
                this.detectTimer = setInterval(() => {
                    const data = soundMeter.instant.toFixed(2);
                    this.setState({soundLevel: data > 1 ? 1 : data})
                }, 200);
            }
        });
    }
    recordVideo(){
        if(!this.mediaHolder.recorder){
            this.mediaHolder.createRecorder();
        }
        this.mediaHolder.startRecord();
        this.mediaHolder.once('video-recorded',()=>this.mediaHolder.downloadRecorded('downloadWrapper'));
        setTimeout(() => {
            this.mediaHolder.stopRecord();
        }, 10000);
    }
    connectToPeerServer(){
        let uniqueId = localStorage.getItem('uniqueid');
        if(!uniqueId){
            uniqueId = genRandomStr(10);
            localStorage.setItem('uniqueid', uniqueId);
        }
        this.state.uniqueId = uniqueId;
        console.log(this.state.uniqueId)
        let host = env === 'development' ? 'localhost': 'webchat.yutengrock.com'; //FIXME:use config to make it
        let peer = new Peer(uniqueId,{host:host,port:9000,path:'/myapp'}); // supposed to pass id in,omit it will get a random one from the server
        this.setState({peer});
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                console.log(data);
            }
            )
        });
        peer.on('call',(call) => { // answer when you get called
            call.answer(this.state.stream);
            call.once('stream', (remoteStream) => {
                console.log(remoteStream);
                let video = this.mediaHolder.play('peerVideoWrapper', remoteStream);
                video.muted = false;
            })
        })

    }
    startVideoChat(id){
        console.log('start video chat with', id)
        // this.connectOther(id);
        let call = this.state.peer.call(id, this.state.stream);
        call.once('stream',(remoteStream) => {
            console.log(remoteStream);
            let video = this.mediaHolder.play('peerVideoWrapper', remoteStream);
            video.muted = false;
        })
    }
    disconnectToPeerServer(){
        console.log('not done yet')
    }
    render() {
        const handlers = {
            connectOther: this.connectOther,
            recordVideo: this.recordVideo,
            connectToPeerServer: this.connectToPeerServer,
            startVideoChat: this.startVideoChat,
            disconnectToPeerServer: this.disconnectToPeerServer
        }
        return (
            <WebChatComponent {...handlers} {...this.state}></WebChatComponent >
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        videoInvationModal: state.modals[MODAL_VIDEO_CHAT_INVITATION]
    }
}
const mapDispatchToProps = dispatch => {
    return {
        closeVideoModal: () => {
            dispatch(closeVideoInvitationModal());
        },
        openVideoModal: () => {
            dispatch(openVideoInvitationModal())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WebChat);