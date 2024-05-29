import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';
import { ICarouselListItem } from '../../splashPage.types';

const ListExlusiveProductListItem: React.FC<ICarouselListItem> = (props) => {
  const { carouselItemTitle, carouselItemImg, carouselDescription } = props;
  return (
    <div className="join-pic-list">
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

export default ListExlusiveProductListItem;
