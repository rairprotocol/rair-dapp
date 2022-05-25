
import React from 'react';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import { IMobileCarouselNfts } from '../aboutPage.types';

const MobileCarouselNfts: React.FC<IMobileCarouselNfts> = (props) => {
    const { children, screen } = props;
    const responsive = {
        mobile: {
            breakpoint: { max: screen ? screen : 750, min: 0 },
            items: 1,
        },
    };

    return (
        <div className="nft-select-mobile">
            <Carousel
                showDots={true}
                infinite={true}
                responsive={responsive}
                itemClass="carousel-item-padding-4-px"
            >
                {children}
            </Carousel>
        </div>
    )
}

export default MobileCarouselNfts
