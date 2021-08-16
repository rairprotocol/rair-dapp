import React from 'react';
import Slider from "react-slick";
import './PepeSlider.css';
import {connect} from 'react-redux'
import {web3connect, fetchPEPE, buyPEPE, instantiateRAIRPEPEContract} from './../actions';

class PepeSlider extends React.Component {
  constructor(props) {
    super(props)
    this.renderPEPE.bind(this);
  }


  componentWillMount() {
    window.addEventListener('load',() => {
      this.props.web3connect();
      this.props.instantiateRAIRPEPEContract().then(() => {
        this.props.fetchPEPE(true);
      });
    });
  }

  renderPEPE(RAIRPepe) {
    return RAIRPepe.map(rair => {
      return <div key= {rair.id + "available PEPE"}>
        <img id={rair.id} className="slider-image" alt="" src={rair.url}  onClick={this.availablePEPEClicked.bind(this)} />
      </div>
    });
  }

  availablePEPEClicked(e,data) {
    const id = e.target.id;
    const url = e.target.src;
    this.props.instantiateRAIRPEPEContract().then(() => {
      this.props.buyPEPE({
        id:id,
        url:url
      });
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
        {this.renderPEPE(this.props.RAIRPepe)}
      </Slider>
    );
  }
}

const mapDispatchToProps = {
  web3connect,
  instantiateRAIRPEPEContract,
  fetchPEPE,
  buyPEPE
};

const mapStateToProps = (state) => ({
  web3:state.web3,
  PEPEContract: state.PEPEContract,
  RAIRPepe: state.RAIRPepe
});

export default connect(mapStateToProps, mapDispatchToProps)(PepeSlider);