import React from 'react';
import Slider from 'react-slick';

import { ILogoCarousel } from '../types/logocarousel.types';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './LogoCarousel.module.css';

/* documentation for setting props */

const LogoCarousel: React.FC<ILogoCarousel> = ({ logos }) => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    lazyLoading: 'progress',
    pauseOnFocus: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };
  return (
    <div className={styles.outer_wrapper}>
      <Slider {...settings}>
        {logos.map((logo, i) => {
          return (
            <div key={i} className={styles.inner_wrappers}>
              <img className={styles.logo_img} src={logo} />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default LogoCarousel;
