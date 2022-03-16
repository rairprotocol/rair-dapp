import './Carousel.css'
import Carousel from "react-multi-carousel"

const CarouselListItem = (props) => {
    const {carouselItemTitle, carouselItemImg} = props
    return (
        <div className="join-pic-list">
            <h4 className="carousel-items"> {carouselItemTitle} </h4>
            <img
            className="join-pic-img"
            src={carouselItemImg}
            alt="community-img"
            />
        </div>
    )
}

const CarouselItem = (props) => {
    const {carouselItemTitle, carouselItemImg} = props
    return (
        <div className="join-pic-carousel">
            <h4 className="carousel-items"> {carouselItemTitle} </h4>
            <img
            className="join-pic-img"
            src={carouselItemImg}
            alt="community-img"
            />
        </div>
    )
}

const CarouselModule = (props) => {
    const {carousel, carouselData} = props

    const responsive = {
        mobile: {
            breakpoint: { max: 750, min: 0 },
            items: 1,
        },
    };


    return (
        <div className="carousel-container">
        <h2 className="carousel-title"> 3 Unique Styles </h2>
        { carousel 
        ? <Carousel
            showDots={true}
            infinite={true}
            responsive={responsive}
            className="carousel"
            >
            {carouselData.map(row => <CarouselItem carouselItemTitle={row.title} carouselItemImg={row.img}/>)} 
        </Carousel>

            
        : <div className="carousel-list">
            {carouselData.map(row => <CarouselListItem carouselItemTitle={row.title} carouselItemImg={row.img}/>)} 
            </div>
        }
        </div>
    )
}

export default CarouselModule;