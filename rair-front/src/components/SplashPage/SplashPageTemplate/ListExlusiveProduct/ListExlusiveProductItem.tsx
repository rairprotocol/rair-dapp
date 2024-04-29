import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';
import { ICarouselItem } from '../../splashPage.types';

const ListExlusiveProductItem: React.FC<ICarouselItem> = (props) => {
  const { carouselItemTitle, carouselItemImg, carouselDescription } = props;
  return (
    <div className="join-pic-carousel">
      {carouselItemTitle && (
        <h4 className="carousel-items"> {carouselItemTitle} </h4>
      )}
      <ImageLazy
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

export default ListExlusiveProductItem;
