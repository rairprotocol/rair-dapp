import React from "react";
import './PepeSlider.css';
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import {web3connect, fetchPEPE, buyPEPE, mintPEPE, instantiateRAIRPEPEContract} from './../actions';

class OwnerView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: '',
            ipfshash: '',
        };
        this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    componentWillUnmount() {
        window.addEventListener('loading', () => {
            this.props.web3connect();
        });
    }

    availablePEPEClicked() {
        this.props.instantiateRAIRPEPEContract().then(() => {
            this.props.buyPEPE();
        });
    }

    handleUploadImage(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('filename' (this.fileName.value || this.uploadInput.files[0].name).replace(/[\W_]+/g," "));
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: data,
        }).then((response) => {
            response.json().then((body) => {
              this.props.instantiateRAIRPEPEContract().then(() => {
                this.props.mintPEPE({price: this.priceInEther.value, hash:body.ipfsHash});
              });
              this.setState({ imageURL: `http://localhost:3000/${body.file}`, ipfsHash:body.metadata });
            });
          });
        }
    render() {
        return (
            <React.Fragment>
                <h5 className="aligned-text">
                    <span>Contract Owner</span>
                    <span><img className="icon" src={`./icons/check.png`} alt="icon"/></span> 
                </h5>
        
                <h5 className="aligned-text">
                    Get started by uploading new content. Next, select the new PEPE to be minted into the RAIR Marketplace.           
                </h5>
        
                <div className="owner-view-container">
                    <form onSubmit={this.handleUploadImage}>
                    <Grid container spacing={24}>
                        <Grid item xs={6} sm={6}>
                            <div>
                                <input className="input-button" ref={(ref) => { this.uploadInput = ref; }} type="file" />
                            </div>
                            <div>
                                <input className="input-box" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
                            </div>
                            <div>
                                <input className="input-box" ref={(ref) => { this.priceInEther = ref; }} type="text" placeholder="Enter price (in ether)" />
                            </div>
                            <div>
                                <button className="button">Mint!</button>
                            </div>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <img className='slider-image' src={this.state.imageURL} alt="img" />
                        { this.state.ipfsHash != null && 
                            <p><a href={this.state.ipfsHash}>Metadata!</a></p>
                        }
                        </Grid>
                    </Grid>
                </form>
                </div>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = {
    web3connect,
    instantiateRAIRPEPEContract,
    fetchPEPE,
    buyPEPE,
    mintPEPE
};

const mapStateToProps = (state) => ({
    web3: state.web3,
    PEPEContract: state.PEPEContract,
});

export default connect(mapStateToProps, mapDispatchToProps)(OwnerView);
