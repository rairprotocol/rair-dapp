import React from 'react'
import firstPict from '../assets/Graphics-WEB-2021-01.png'
import secondPict from '../assets/Graphics-WEB-2021-02.png'
import thirdPict from '../assets/Graphics-WEB-2021-03.png'
import foPict from '../assets/terp.png'
import NftItem from './NftItem'

const arrPic = [
    firstPict , secondPict , thirdPict , foPict
]

const NftList = () => {
    return (
        <div className={'list-button-wrapper'}>
            {
                arrPic.map((pict, index) => <NftItem key={index} pict = {pict}/>)
            }

        </div> 
    )
}

export default NftList
