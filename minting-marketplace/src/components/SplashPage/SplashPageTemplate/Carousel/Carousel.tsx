//@ts-nocheck
import React from 'react';
import './Carousel.css';
import Carousel from 'react-multi-carousel';

const CarouselListItem = (props) => {
  const { carouselItemTitle, carouselItemImg, carouselDescription } = props;
  return (
    <div className="join-pic-list">
      {carouselItemTitle && (
        <h4 className="carousel-items"> {carouselItemTitle} </h4>
      )}
      <img
        className="join-pic-img"
        src={carouselItemImg}
        alt="Join to community"
      />
      {carouselDescription && (
        <h6 className="carousel-description">{carouselDescription}</h6>
      )}
    </div>
  );
};

const CarouselItem = (props) => {
  const { carouselItemTitle, carouselItemImg, carouselDescription } = props;
  return (
    <div className="join-pic-carousel">
      {carouselItemTitle && (
        <h4 className="carousel-items"> {carouselItemTitle} </h4>
      )}
      <img
        className="join-pic-img"
        src={carouselItemImg}
        alt="Join to community"
      />
      {carouselDescription && (
        <h6 className="carousel-description">{carouselDescription}</h6>
      )}
    </div>
  );
};

const CarouselModule = (props) => {
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
          {carouselData.map((row, index) => (
            <CarouselItem
              key={index}
              carouselItemTitle={row.title}
              carouselItemImg={row.img}
              carouselDescription={row.description}
            />
          ))}
        </Carousel>
      ) : (
        <div className="carousel-list">
          {carouselData.map((row, index) => (
            <CarouselListItem
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

export default CarouselModule;
