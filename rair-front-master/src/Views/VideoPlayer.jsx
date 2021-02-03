import React, {useEffect, useState} from 'react';
import videojs from 'video.js';
import Swal from 'sweetalert2';

const VideoPlayer = ({address, video}) => {

    const [mediaAddress, setMediaAddress] = useState()
    const [videoName, ] = useState(Math.round(Math.random() * 10000));

    useEffect(() => {
        // Sign a challenge to check for the RAIR Token
        fetch('/api/auth/get_challenge/'+address)
            .then(blob => blob.json())
            .then(response => {
                    window.ethereum.request({
                        method: "eth_signTypedData_v4",
                        params: [address, JSON.stringify(response)],
                        from: address
                    })
                    .then(e => {
                        fetch('/api/auth/get_token/'+response.message.challenge+'/'+e+'/'+video.cid)
                        .then(blob => blob.text())
                        .then(res => {
                            try
                            {
                                let aux = JSON.parse(res);
                                if (aux.error)
                                {
                                    Swal.fire('Error',aux.message,'error');
                                }
                            }
                            catch (e)
                            {
                                setMediaAddress('/stream/'+res+'/'+video.cid+'/'+video.mainManifest);
                                setTimeout(() => {
                                    videojs('vjs-'+videoName)
                                }, 1000)
                            }
                        })
                    })
            })
    }, [address, video.cid, video.mainManifest, videoName])

    useEffect(() => {
       return () => {
           setMediaAddress();
       }
    }, [])

    return <div className='w-100 row mx-0 bg-secondary h1' style={{minHeight: '50vh'}}>
        <video id={'vjs-'+videoName}
                className="video-js vjs-16-9"
                controls
                preload='auto'
                autoPlay
                poster={video && ("/thumbnails/"+video.thumbnail+'.png')}
                data-setup="{}">
            <source
                src={mediaAddress}
                type="application/x-mpegURL"/>
        </video>
    </div>
}

export default VideoPlayer;