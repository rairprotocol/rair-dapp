import React from 'react'
import firstPict from '../assets/Graphics-WEB-2021-01.png'
import secondPict from '../assets/Graphics-WEB-2021-02.png'
import thirdPict from '../assets/Graphics-WEB-2021-03.png'
import NftItem from './NftItem'

const NftList = ({data, primaryColor, textColor, titleSearch}) => {
    const filteredData = data && data.filter(
        item => {
            return (
                item.name.toLowerCase().includes(titleSearch.toLowerCase())     
            )
        }
    )

    return (
        <div className={'list-button-wrapper'}>
            {
                filteredData && filteredData.map((pict, index) => {
                    if (pict.cover !== 'none') {
                        return (<NftItem onClick={() => console.log('nftList', data)}
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
                            collectionIndexInContract={pict.collectionIndexInContract}
                            />)
                    } else {
                        return null
                    }
                })
            }
            <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'} width="291" height="291" src={firstPict} alt="first" />
            <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'} width="291" height="291" src={secondPict} alt="first" />
            <img className={'col-12 col-sm-6 col-md-4 col-lg-3 px-1 text-start pictures-wrapper'} width="291" height="291" src={thirdPict} alt="first" />
        </div>
    )
}

export default NftList
