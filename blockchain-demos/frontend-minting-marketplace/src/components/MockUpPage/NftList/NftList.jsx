import React from 'react'
import firstPict from '../assets/Graphics-WEB-2021-01.png'
import secondPict from '../assets/Graphics-WEB-2021-02.png'
import thirdPict from '../assets/Graphics-WEB-2021-03.png'
import foPict from '../assets/terp.png'
import NftItem from './NftItem'

const arrPic = [
    firstPict , secondPict , thirdPict , foPict
]

const NftList = ({data, primaryColor, textColor}) => {
    return (
        <div className={'list-button-wrapper'}>
                <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'} width="291" height="291" src={firstPict} alt="first" />
                <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'}  width="291" height="291" src={secondPict} alt="first" />
                <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'}  width="291" height="291" src={thirdPict} alt="first" />
               
            {
                data?.map((pict, index) => {
                    if(pict.cover !== 'none'){
                        return(<NftItem onClick={() => console.log('nftList',data)} 
                            key={index} 
                            pict={pict.cover} 
                            contract={pict.contract}
                            primaryColor={primaryColor}
                            textColor={textColor}
                            collectionIndexInContract={pict.collectionIndexInContract}/>)
                    } else {
                        return null
                        // return(<img width="291" height="291" key={index} src={firstPict} alt="first" />)
                    }
                
                })
            }

        </div> 
    )
}

export default NftList
