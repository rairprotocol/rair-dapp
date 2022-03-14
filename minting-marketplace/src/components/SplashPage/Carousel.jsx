import MobileCarouselNfts from "../AboutPage/AboutPageNew/ExclusiveNfts/MobileCarouselNfts"
import "./SplashPage.css";
import "./GreymanSplashPageMobile.css";
import "./../AboutPage/AboutPageNew/AboutPageNew.css";

const CarouselListItem = (props) => {
    const {carouselItemTitle, carouselItemImg} = props
    return (
        <div className="join-pic-list">
            <h4 className="carousel-items"> {carouselItemTitle} </h4>
            <img
            className="join-pic-img-list"
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

const Carousel = (props) => {
    const {carousel, carouselData} = props
    return (
        <div className="exclusive-nfts" style={{marginTop: "80px"}}>
        <h2 className="carousel-title"> 3 Unique Styles </h2>
        { carousel 
        ? <MobileCarouselNfts> 
            {carouselData.map(row => <CarouselItem carouselItemTitle={row.title} carouselItemImg={row.img}/>)} 
            </MobileCarouselNfts>
        : <div className="list-of-immersiverse-pic">
            {carouselData.map(row => <CarouselListItem carouselItemTitle={row.title} carouselItemImg={row.img}/>)} 
            </div>
        }
        </div>
    )
}

export default Carousel;