import { EventEmitter } from 'eventemitter3';
class Media extends EventEmitter {
    constructor(options) {
        super(options);
        this.options = options; // initiation options
        this.stream = null; // hold stream
        this.recordedFile = null; // hold recorded file
        this.capturedImage = null; // hold the captured image
    }
    /**
     *
     *
     * @returns stream from getusermedia or getdisplaymedia
     * @memberof Media
     */
    createStream() {
        try {
            if (this.options.video) {
                if (this.options.streamSource === 'screen') { // 用屏幕共享作为源
                    return navigator.mediaDevices.getDisplayMedia(this.options).then((stream) => {
                        this.stream = stream;
                        return stream;
                    }).catch((err) => {
                        throw err;
                    });
                }
                if (this.options.streamSource === 'camera') {
                    return navigator.mediaDevices.getUserMedia(this.options).then((stream) => {
                        this.stream = stream;
                        return stream;
                    }).catch((err) => {
                        throw err;
                    });
                }
            } else if (this.options.audio) {
                return navigator.mediaDevices.getUserMedia(this.options).then((stream) => {
                    this.stream = stream;
                    return stream;
                }).catch((err) => {
                    throw err;
                });
            }
            throw Error('video 和 audio 不能同时为false');
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     *
     *
     * @param {Function} stopCb do some thing after record stop 
     * @memberof Media
     */
    createRecorder() {
        let chunks = [];
        try {
            this.recorder = new MediaRecorder(this.stream);
            this.recorder.onstop = (e) => {
                this.isRecording = false;
                this.recordedFile = new Blob(chunks, {
                    type: 'video/mp4'
                })
                chunks = [];
                this.emit('video-recorded');
            }
            this.recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            }

        } catch (err) {
            console.log(err);
        }
    }
    startRecord() {
        console.log('%c start record', 'color:red;');
        this.recorder.start();
    }
    stopRecord(){
        console.log('%c stop record', 'color:red;');
        this.recorder.stop();
    }
    /**
     *
     *
     * @param {*} id of the container to put the downloadable mp4
     * @memberof Media
     */
    downloadRecorded(id){
        const video = document.createElement('video');
        const downloadWrapper = document.querySelector(`#${id}`);
        const url = URL.createObjectURL(this.recordedFile);
        video.src = url;
        video.controls = true;
        video.download = `${new Date().valueOf()}.mp4`;
        if(downloadWrapper){
            downloadWrapper.appendChild(video);
        }
    }
    captureImage(video,id){
        const canvas = document.createElement('canvas');
        const tracks = this.stream.getVideoTracks();
        const vtrack = tracks[0];
        const settings = vtrack.getSettings();
        const {aspectRatio} = settings;
        const height = 600; // TODO: make it configurable later;
        canvas.width = parseInt(height * aspectRatio, 10) || height; // aspectRatio is not supported in firefox
        canvas.height = height;
        function drawVideo(context){
            try{
                context.drawImage(video, 0 ,0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    this.captureImage = blob;
                    this.emit('image-captured');
                }, 'image/png')
            }catch(e){
                console.log(e);
            }
        }
        const context = canvas.getContext('2d');
        drawVideo(context);
    }
    /**
     *
     *
     * @param {*} id id of the div elememt
     * @memberof Media
     */
    play(id) {
        // should check whether the stream is video or audio only
        const playerContainer = document.querySelector(`#${id}`);
        if (this.stream) {
            const video = document.createElement('video');
            video.srcObject = this.stream;
            video.controls = false;
            video.muted = true; // TODO: make it configurable, autoplay limit in chrome
            playerContainer.appendChild(video);
            video.play();
            return video;
        }
    }
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
            this.stream = null;
        }

    }
    getDevices(kind) {
        try {
            return navigator.mediaDevices.enumerateDevices().then((devices) => {
                this.devices = devices;
                const filterd = devices.filter((item) => {
                    if (!kind) {
                        return true;
                    }
                    return item.kind === kind;
                });
                console.log(filterd);
                return filterd;
            }).catch((err) => {

            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    getAudioDevices() {
        return this.getDevices('audioinput');
    }

    getVideoDevices() {
        return this.getDevices('videoinput');
    }
}

export default Media;