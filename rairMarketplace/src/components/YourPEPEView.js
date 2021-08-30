import React from "react";
import Slider from "react-slick";
import './PepeSlider.css';
import {connect} from 'react-redux'
import {web3connect, fetchPEPE, instantiateRAIRPEPEContract} from './../actions';

class YourPEPEView extends React.Component {
    constructor(props) {
        super(props)
        this.renderPEPE.bind(this);
    }

    componentWillUnmount(){
        window.addEventListener('load', () => {
            this.props.web3connect();
            this.props.instantiateRAIRPEPEContract().then(() => {
                this.props.fetchPEPE(true);
            });
        });
    }

    renderPEPE(yourPEPE) {
        return yourPEPE.map(rair => {
            return <div key={rair.id + "your PEPE"}>
                <img className="slider-image" alt="" src={rair.url} />
            </div>
        });
    }

    render() {
        var settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 7,
            slidesToScroll: 6,
            arrows: true
        };
        return (
            <Slider {...settings}>
                {this.renderPEPE(this.props.yourPEPE)}
            </Slider>
        );
    }
}

const mapDispatchToProps = {
    web3connect,
    instantiateRAIRPEPEContract,
    fetchPEPE
};

const mapStateToProps = (state) => ({
    web3: state.web3,
    PEPEContract: state.PEPEContract,
    yourPEPE: state.yourPEPE
});

export default connect(mapStateToProps, mapDispatchToProps)(YourPEPEView);