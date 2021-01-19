import React, { useState, useEffect } from 'react';
import './App.css';

import { Button, Card, CardBody, Input, Label } from 'reactstrap';
import _ from "lodash";

const seekDebounce = _.debounce((val, callback) => callback(val), 500)
const volumeDebounce = _.debounce((val, callback) => callback(val), 20)

const REACT_APP_PROXY = process.env.REACT_APP_PROXY
console.log(REACT_APP_PROXY)


const time_format_HHMMSS = (seconds) => {
    if (seconds === null) return '---'

    // Source: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
    // Hours, minutes and seconds
    var hrs = Math.floor(seconds / 3600);
    var mins = Math.floor((seconds % 3600) / 60);
    var secs = Math.floor(seconds % 60);

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


const App = () => {
    const [url, setUrl] = useState('http://10.0.1.21:5001/stream/xxh64:969bb0155658e52e');
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSeek, setCurrentSeek] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(null);
    const [duration, setDuration] = useState(null);

    useEffect(() => {
        fetch(REACT_APP_PROXY + '/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
        getStatus()
        setInterval(getStatus, 1000)
    }, []);

    const getStatus = () => {
        fetch(REACT_APP_PROXY + '/status')
            .then(function(response) {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong.')
            })
            .then(function(data) {
                console.log(data)
                let status = data.result
                setDuration(status.duration)
                setCurrentSeek(status.current_time / status.duration)
                setCurrentVolume(status.volume_level)
            })
    }

    const start = () => {
        let payload = {
            'url': url,
            'content_type': 'video',  // TODO: audio allows album artwork, etc
        }

        fetch(REACT_APP_PROXY + '/start', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong.')
            })
            .then(function(data) {
                if (data.result) {
                    console.log('good')
                } else {
                    console.error('bad')
                }
            })
    }

    const toggle = () => {
        fetch(REACT_APP_PROXY + '/toggle', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(null),
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong.')
            })
            .then(function(data) {
                if (data.result) {
                    console.log('good')
                } else {
                    console.error('bad')
                }
            })
    }

    const seek = (time) => {
        console.log(time)
        let payload = {
            'rel': time,
        }
        fetch(REACT_APP_PROXY + '/seek', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong.')
            })
            .then(function(data) {
                if (data.result) {
                    console.log('good')
                } else {
                    console.error('bad')
                }
            })
    }

    const volume = (val) => {
        console.log(val)
        let payload = {
            'rel': val,
        }
        fetch(REACT_APP_PROXY + '/volume', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Something went wrong.')
            })
            .then(function(data) {
                if (data.result) {
                    console.log('good')
                } else {
                    console.error('bad')
                }
            })
    }

    const seekWrap = (val) => {
        setCurrentSeek(val);
        seekDebounce(val, seek);
    }

    const volumeWrap = (val) => {
        setCurrentVolume(val);
        volumeDebounce(val, volume);
    }

    const humanDuration = () => {
        if (duration === null || currentSeek === null) {
            return '---'
        } else {
            let currentDuration = duration * currentSeek
            return time_format_HHMMSS(currentDuration)
        }
    }

    const humanVolume = () => {
        if (currentVolume === null) {
            return '---'
        } else {
            return Math.round(currentVolume * 100) + '%'
        }
    }

    return (
        <div className="App">
            <header className="App-header" style={{'min-height': '20vh'}}>
                <div>📺 CastController</div>
                <p>The current time is {currentTime}.</p>
            </header>

            <Card>
                <CardBody>
                    <div className="mc-pad">
                        <Label>Source:</Label>
                        <Input value={url} onChange={e => setUrl(e.target.value)}/>
                    </div>
                    <div className="mc-pad">
                        <Button className="mc-button" onClick={() => setUrl('')}>Clear</Button>
                        <Button className="mc-button" onClick={start}>Start</Button>
                        <Button className="mc-button" onClick={toggle}>Play / Pause</Button>
                    </div>
                    <Card className="mc-pad">
                        <div>Seek</div>
                        <Input type="range" min={0} max={1} step={0.001} value={currentSeek} onChange={e => seekWrap(e.target.value)}/>
                        <div>{humanDuration()} / {time_format_HHMMSS(duration)}</div>
                    </Card>
                    <Card className="mc-pad">
                        <div>Volume</div>
                        <Input type="range" min={0} max={1} step={0.001} value={currentVolume} onChange={e => volumeWrap(e.target.value)}/>
                        <div>{humanVolume()}</div>
                    </Card>
                </CardBody>
            </Card>
        </div>
    );
}

export default App;
