import React from 'react'
import firstPict from '../assets/Graphics-WEB-2021-01.png'
import secondPict from '../assets/Graphics-WEB-2021-02.png'
import thirdPict from '../assets/Graphics-WEB-2021-03.png'
import NftItem from './NftItem'

const NftList = ({data, primaryColor, textColor}) => {
    return (
        <div className={'list-button-wrapper'}>
            {
                data?.map((pict, index) => {
                    // if (index > 20) {
                    //     return 'A eto esche odin komponent';
                    // }
                    if(pict.cover !== 'none'){
                        return(<NftItem onClick={() => console.log('nftList',data)} 
                            key={`${pict.id}-${pict.productId}`}
                            pict={pict.cover}
                            allData={pict}
                            contractName={pict.contract}
                            price={pict.offerData.map(p => p.price)}
                            primaryColor={primaryColor}
                            textColor={textColor}
                            blockchain={pict.blockchain}
                            collectionName={pict.name}
                            ownerCollectionUser={pict.user}
                            collectionIndexInContract={pict.collectionIndexInContract}/>)
                    } else {
                        return null
                        // return(<img width="291" height="291" key={index} src={firstPict} alt="first" />)
                    }
                
                })
            }
                <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'} width="291" height="291" src={firstPict} alt="first" />
                <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'}  width="291" height="291" src={secondPict} alt="first" />
                <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'}  width="291" height="291" src={thirdPict} alt="first" />
        </div> 
    )
}

export default NftList
