import React from 'react'
import VideoList from '../video/videoList.jsx';
import NftList from './NftList/NftList.jsx';
import SearchPanel from './SearchPanel'

const mockUpPage = ({item, primaryColor, textColor}) => {
    return (
    <div className={'mock-up-page-wrapper'}>
        <SearchPanel primaryColor={primaryColor} textColor={textColor} />
        {/* <NftList /> */}
        {/* <VideoList primaryColor={primaryColor}/> */}
    </div>
    )
}
export default mockUpPage;