//@ts-nocheck
//test page for video tiles

import NFTLA_Video from "../../images/NFT-LA-RAIR-2021.mp4"
import VideoTiles from "./VideoTiles"
import { useSelector } from "react-redux";
const videoArr = [
    {
        videoName: "Welcome to NFTLA",
        videoType: "NFTLA-EXCLUSIVE-1",
        videoTime: "00:00:00",
        videoSRC: NFTLA_Video,
    },
    {
        videoName: "Ukraine Glitch",
        videoType: "UKR-EXCLUSIVE-1",
        videoTime: "00:00:00",
        videoSRC: null,
        baseURL: 'https://storage.googleapis.com/rair-videos/',
        mediaId: 'VUPLZvYEertdAQMiZ4KTI9HgnX5fNSN036GAbKnj9XoXbJ',
    },
    {
        videoName: "Greyman",
        videoType: "NFTLA-EXCLUSIVE-3",
        videoTime: "00:00:00",
        videoSRC: null,
        baseURL: 'https://storage.googleapis.com/rair-videos/',
        mediaId: 'QmU8iCk2eE2V9BV6Bo6QiXEgQqER1zf4fnsnStNxH77KH8J',
    },
    {
        videoName: "No Video",
        videoType: "NFTLA-EXCLUSIVE-4",
        videoTime: "00:00:00",
        videoSRC: null,
    }
]


const VideoTilesTest = () => {
    const { primaryColor } = useSelector((store) => store.colorStore);
    return (
        <VideoTiles title={"test"} videoArr={videoArr} primaryColor={primaryColor}/>
    )
}

export default VideoTilesTest;
