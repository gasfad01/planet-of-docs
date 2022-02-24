// Front-end
import React, { Component } from "react";
import MetaTags from 'react-meta-tags';

// UI
import 'bootstrap/dist/css/bootstrap.min.css';
import TransferAsset from "../assets/img/transfer.png";

// Contract
import getWeb3 from "../getWeb3";
import PlanetOfDocs from "../contracts/PlanetOfDocs.json";

class Transfer extends Component {
  constructor(props){
    super(props)
    this.state = {
      web3: null, accounts: null, contract: null,
      activeAccount: 'Anonymous',
      buffer: null,
      hashToCheck: '',
    }
    this.handleIpfsHash = this.handleIpfsHash.bind(this);
    this.handleRecipient = this.handleRecipient.bind(this);
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
          this.setState({ buffer: null})
          this.setState({ hashToCheck: '' })
          this.setState({ ipfsHashTemp: '' })
          this.setState({ recipientAccountTemp: '' })
          this.setState({ ipfsHash: '' })
          this.setState({ recipientAccount: '' })
          this.setState({ transactionHash: '' })
          this.state.contract.methods.getFilesByOwner(this.state.activeAccount).call((error, result) => {
            if(error){
              console.log(error)
            } else {
              this.setState({ fileIds: result })
              this.state.contract.methods.getOwnerFileDetails(
                this.state.activeAccount,
                this.state.fileIds).call(
                  (error, (fileNames, fileHashes) => {
                    this.setState({fileNames: fileNames})
                    this.setState({fileHashes: fileHashes})
                  })
                )
            }
          })
        }
      } catch (error) {
        alert(`You are offline, connect to metamask to continue.`);
        console.error(error);
      }
    }, 500)
  }

  handleIpfsHash(event) {
    event.preventDefault()
    this.setState({ipfsHashTemp: event.target.value});
  }

  handleRecipient(event) {
    event.preventDefault()
    this.setState({recipientAccountTemp: event.target.value});
  }

  transferOwnership = async(event) => {
    event.preventDefault()
    let transferOwnershipForm = document.getElementsByName("transferOwnershipForm")[0];
    await this.state.contract.methods.getFileIdByHash(this.state.ipfsHashTemp).call((err, value) => {
      if(err) {
        console.error(err);
      } else {
        // Retrieve File ID
        let fileId = value[0];
        this.setState({ fileId })

        // Check whether recipient address == sender address
        if(this.state.activeAccount === this.state.recipientAccountTemp){
          alert(`Unable to transfer your files to yourself.`);
          transferOwnershipForm.reset()
        } else {
          // Check whether file owned by current activeAccount
          this.state.contract.methods.checkFileExistByHash(this.state.ipfsHashTemp).call((error, owner) => {
            if(error) {
              console.error(error);
              transferOwnershipForm.reset()
            } else {
              if(owner[1] === this.state.activeAccount) {
                this.setState({ ipfsHash: this.state.ipfsHashTemp})
                this.setState({ recipientAccount: this.state.recipientAccountTemp })
                this.state.contract.methods._transfer(
                  this.state.activeAccount,
                  this.state.recipientAccount,
                  this.state.fileId).send({from: this.state.activeAccount}, (errorTx, transactionHash) => {
                    if(errorTx) {
                      console.error(errorTx)
                    } else {
                      this.setState({ transactionHash: transactionHash})
                    }
                    transferOwnershipForm.reset()
                  })   
              } else {
                alert(`Can only transfer files that belong to you.`);
                transferOwnershipForm.reset()
              }
            }
          })
        }
      }
    })
  }

  render () {
    return (
      <section id="Transfer" className="p-5">
        <MetaTags>
          <title>Transfer - PoD</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta id="meta-description" name="description" content="Ethereum x IPFS DApp." />
          <meta id="og-title" property="og:title" content="Planet of Docs" />
        </MetaTags>

        <div className="container">
          <div className="justify-content-between">
            <div>
              <img src={TransferAsset} className="mx-auto d-block" alt="" width="20%" height="20%" />
            </div>

            <div className="px-3 d-flex align-items-center justify-content-center">
              <h1>Transfer</h1>
            </div>

            <div className="px-3 pt-3 d-flex align-items-center justify-content-center">
              <p className="lead text-center">
                Transfer ownership to other account<br />
                <span className="fs-6">
                <span className="fs-6 fw-bold">NOTE:</span> In 
                <span className="fs-6 fst-italic fw-bold"> Transfer Ownership </span> 
                section, you can't change anything whose ownership has been transferred, be careful.</span>
              </p>
            </div>

            <hr />

            <div className="py-3 d-flex align-items-center justify-content-center">
              <h2>Account: {this.state.activeAccount}</h2>
            </div>

            {/* Live Transaction Log*/}

            <div className="pb-3">
              <h3>Live Transfer Log</h3>
              <table className="table table-striped table-hover">
                <thead>
                <tr>
                  <th scope="col" width="175">Property</th>
                  <th scope="col">Value</th>
                </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>IPFS Hash</td>
                    <td>{this.state.ipfsHash}</td>
                  </tr>
                  <tr>
                    <td>Recipient</td>
                    <td>{this.state.recipientAccount}</td>
                  </tr>
                  <tr>
                    <td>Tx Hash</td>
                    <td>{this.state.transactionHash}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transfer Ownership */}

            <h3>Transfer Ownership</h3>
            <div className="pb-3">
              <form name="transferOwnershipForm" onSubmit={this.transferOwnership}>
                <div className="mb-3">
                  <label htmlFor="fileHashTransfer" className="form-label">File Hash</label>
                  <input type="text input-block-level" className="form-control" id="fileHashTransfer" onChange={this.handleIpfsHash} required/>
                  <div id="fileHashTransferNote" className="form-text">You can only transfer file owned by you.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="recipientTransfer" className="form-label">Recipient Address</label>
                  <input type="text input-block-level" className="form-control" id="recipientTransfer" onChange={this.handleRecipient} required/>
                  <div id="recipientTransferNote" className="form-text">Recipient account address, please recheck.</div>
                </div>        
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="transactionCheck" required/>
                  <label className="form-check-label" htmlFor="transactionCheck">Check this box if everything is correct.</label>
                </div>
                <div className="row mx-5 py-3">
                  <button type="submit" className="btn btn-outline-primary col-6 mx-auto">Transfer</button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
        
      </section>
    );
  }
}

export default Transfer;