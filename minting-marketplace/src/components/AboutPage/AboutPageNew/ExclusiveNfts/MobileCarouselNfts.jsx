import React from 'react';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

const MobileCarouselNfts = (props) => {
    const responsive = {
        mobile: {
            breakpoint: { max: 600, min: 0 },
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
                {props.children}
            </Carousel>
        </div>
    )
}

export default MobileCarouselNfts
