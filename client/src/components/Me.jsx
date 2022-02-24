// Front-end
import React, { Component } from "react";
import MetaTags from 'react-meta-tags';
// UI
import 'bootstrap/dist/css/bootstrap.min.css';
import MeAsset from "../assets/img/me.png";
import MetamaskAsset from "../assets/img/metamask.png";
// Contract
import PlanetOfDocs from "../contracts/PlanetOfDocs.json";
import getWeb3 from "../getWeb3";

class Me extends Component {
  state = {
    web3: null, accounts: null, contract: null,
    activeAccount: 'Anonymous',
    tagline: 'You are offline, connect to metamask to continue.'
  }

  componentDidMount = async () => {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = PlanetOfDocs.networks[networkId];
    const instance = new web3.eth.Contract(PlanetOfDocs.abi,
      deployedNetwork && deployedNetwork.address,
    );
    this.setState({ web3, contract: instance})
    setInterval(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        this.setState({ accounts });
        if(this.state.activeAccount !== accounts[0]){
          var active = accounts[0];
          this.setState({ activeAccount: active })
          this.setState({ tagline: "You are now online on Planet of Docs!"})
        }
      } catch (error) {
        alert(`You are offline, connect to metamask to continue.`);
        console.error(error);
      }
    }, 500)
  }

  render () {
    return (
      <section id="Me" className="p-5">
        <MetaTags>
          <title>Me - PoD</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta id="meta-description" name="description" content="Ethereum x IPFS DApp." />
          <meta id="og-title" property="og:title" content="Planet of Docs" />
        </MetaTags>

        <div className="container">
          <div className="justify-content-between">
            <div>
              <img src={MeAsset} className="mx-auto d-block" alt="" width="20%" height="20%" />
            </div>

            <div className="px-3 d-flex align-items-center justify-content-center">
              <h1>Me</h1>
            </div>

            <div className="px-3 pt-3 d-flex align-items-center justify-content-center">
              <p className="lead text-center">
                Good Day, <span className="fs-6 fw-bold">{this.state.activeAccount}!</span><br />
                {this.state.tagline}
              </p>
            </div>

            <hr />
            
          </div>
        </div>

        <section id="store" className="px-5 pb-5">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-md text-center">
                <img src={MetamaskAsset} className="img-fluid" width="50%" height="50%" alt="" />
              </div>
              <div className="col-md p-5">
                <h2>Metamask</h2>
                <p className="lead">
                  A crypto wallet &#38; gateway to blockchain apps.
                </p>
                <p>
                  Available as a browser extension and as a mobile app, 
                  MetaMask equips you with a key vault, secure login, token wallet, and token exchange—everything
                  you need to manage your digital assets.
                </p>
                <a href="https://metamask.io/" className="btn btn-light mt-3" target="_blank" rel="noreferrer">
                  <i className="bi bi-chevron-right"></i> Metamask
                </a>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }
}

export default Me;