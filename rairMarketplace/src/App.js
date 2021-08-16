import React, { Component } from 'react';
import PepeSlider from './components/PepeSlider.js';
import OwnerView from './components/OwnerView.js';
import YourPEPEView from './components/YourPEPEView.js';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import {connect} from 'react-redux'
import {web3connect, fetchPEPE, instantiateRAIRPEPEContract, buyPEPE, owner, wallet} from './actions';


var Row = require('react-bootstrap').Row;

class App extends Component {
    constructor(props) {
        super(props)
        this.renderPEPECreatorView.bind(this);
    }

    renderPEPECreatorView(owner,wallet) {
        if(owner === wallet){
            return (
                <OwnerView/>
            );
        }
    }

    componentWillMount() {
        //connect with actions/index.js to web3connect
        window.addEventListener('load', () => {
            this.props.web3connect();
            this.props.instantiateRAIRPEPEContract().then(() => {
                this.props.owner();
                this.props.wallet();
            });
        });
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Row className="container">
                    <h1 className="aligned-text">
                        <span className="header">RAIR PEPE</span>
                        <span className="handwritten">Online Demo Marketplace</span>
                    </h1>
                    {this.renderPEPECreatorView(this.props.contractOwner, this.props.signedInAccount)}
                    <h3 className="aligned-text">Available PEPE:</h3>
                    <PepeSlider/>
                    <h3 className="aligned-text">Your PEPE:</h3>
                    <YourPEPEView/>
                </Row>
            </React.Fragment>
        );
    }

}

const mapDispatchToProps = {
    web3connect,
    instantiateRAIRPEPEContract,
    fetchPEPE,
    buyPEPE,
    wallet,
    owner
};

const mapStateToProps = (state) => ({
    web3: state.web3,
    PEPEContract: state.PEPEContract,
    contractOwner: state.contractOwner,
    signedInAccount: state.signedInAccount
});

export default connect(mapStateToProps,mapDispatchToProps)(App);
