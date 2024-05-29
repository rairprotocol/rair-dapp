import React from 'react';
import Carousel from 'react-multi-carousel';

import ListExlusiveProductItem from './ListExlusiveProductItem';
import ListExlusiveProductListItem from './ListExlusiveProductListItem';

import { ICarouselModule } from '../../splashPage.types';

import './ListExlusiveProduct.css';

const ListExlusiveProduct: React.FC<ICarouselModule> = (props) => {
  const { carousel, carouselTitle, carouselData } = props;

  const responsive = {
    mobile: {
      breakpoint: { max: 900, min: 0 },
      items: 1
    }
  };

  return (
    <div className="carousel-container">
      <h2 className="carousel-title"> {carouselTitle} </h2>
      {carousel ? (
        <Carousel
          showDots={false}
          infinite={true}
          responsive={responsive}
          className="carousel">
          {carouselData?.map((row, index) => (
            <ListExlusiveProductItem
              key={index}
              carouselItemTitle={row.title}
              carouselItemImg={row.img}
              carouselDescription={row.description}
            />
          ))}
        </Carousel>
      ) : (
        <div className="carousel-list">
          {carouselData?.map((row, index) => (
            <ListExlusiveProductListItem
              key={index}
              carouselItemTitle={row.title}
              carouselItemImg={row.img}
              carouselDescription={row.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListExlusiveProduct;
