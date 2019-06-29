import React from 'react';
import { connect } from 'react-redux';
import WebChatComponent from '../components/webChat/WebChat';
import { openVideoInvitationModal, closeVideoInvitationModal, MODAL_VIDEO_CHAT_INVITATION } from '../reducers/modals';
import Peer from 'peerjs';
import Media from '../lib/Media'
import SoundMeter from '../lib/SoundMeter';
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
            detectTimer: null
        }
        this.connectOther = this.connectOther.bind(this);
        this.recordVideo = this.recordVideo.bind(this);
    }
    componentDidMount() {
        this.peer = new Peer() // supposed to pass id in,omit it will get a random one from the server
        this.mediaHolder = new Media(this.state.options);
        this.peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                console.log(data);
            }
            )
        });
        this.initVideo();
    }
    connectOther(id) {
        this.conn = this.peer.connect(id)
    }
    initVideo() {
        this.mediaHolder.createStream().then((stream) => {
            this.stream = stream;
            this.video = this.mediaHolder.play('videoWrapper');
            this.video.controls = true;
            this.video.muted = false;
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
    render() {
        const handlers = {
            connectOther: this.connectOther,
            recordVideo: this.recordVideo
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