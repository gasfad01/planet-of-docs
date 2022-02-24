// Front-end
import React, { Component } from "react";
import MetaTags from 'react-meta-tags';

// UI
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import StoreAsset from "../assets/img/store.png";

// Contract
import getWeb3 from "../getWeb3";
import PlanetOfDocs from "../contracts/PlanetOfDocs.json";

// IPFS
import ipfs from '../ipfs';

class CheckFileExistError extends Error {
  constructor(message, type) {
   super(message);
   this.type = type;
  }
}

class Store extends Component {
  constructor(props){
    super(props)
    this.state = {
      web3: null, accounts: null, contract: null,
      activeAccount: 'Anonymous',
      fileToUpload: null, buffer: null, fileName: '', ipfsHash: '', hashToCheck: '', transactionHash: ''
    }
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
          this.setState({ fileToUpload: null})
          this.setState({ buffer: null })
          this.setState({ fileName: ''})
          this.setState({ ipfsHash: ''})
          this.setState({ hashToCheck: ''})
          this.setState({ transactionHash: ''})
        }
      } catch (error) {
        alert(`You are offline, connect to metamask to continue.`);
        console.error(error);
      }
    }, 500)
  }
  

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    this.setState({ fileToUpload : file })
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  }

  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result)
    this.setState({ buffer : buffer })
  }

  storeFileToIpfs = async (event) => {
    event.preventDefault();
    let content = this.state.fileToUpload
    this.setState({ fileName: content.name })

    let fileUploaded = await ipfs.files.add(this.state.buffer, {onlyHash:true})
    let hashToCheck = fileUploaded[0].hash
    this.setState({hashToCheck: hashToCheck})

    let fileStoreForm = document.getElementsByName("fileStoreForm")[0];
    
    this.state.contract.methods.checkFileExistByHash(this.state.hashToCheck).call((error, val) => {
      try {
        if(error){
          console.error(error)
          const CheckFileExistErrorMessage = "Mr. Stark, I don't feel so good"
          const CheckFileExistErrorType = "Unknown"
          throw new CheckFileExistError(CheckFileExistErrorMessage, CheckFileExistErrorType);
        }

        if(val[0]){
          if(val[1] === this.state.activeAccount){
            this.setState({ fileName: ''})
            const FileExistErrorMessage = "Oops, you've stored this file. This file belongs to: "
            const FileExistErrorType = "File Exist"
            throw new CheckFileExistError(FileExistErrorMessage, FileExistErrorType);
          } else {
            this.setState({ fileName: ''})
            const FileExistErrorMessage = "The file already exists and is stored in our IPFS and belongs to: "
            const FileExistErrorType = "File Exist"
            throw new CheckFileExistError(FileExistErrorMessage, FileExistErrorType);
          }
        } else {
          let store = async () => {
            fileUploaded = await ipfs.files.add(this.state.buffer) 
            let fileHash = fileUploaded[0].hash
            this.setState({ipfsHash: fileHash})

            await this.state.contract.methods.Store(
              this.state.fileName, 
              this.state.ipfsHash,
              this.state.activeAccount
            ).send({from: this.state.activeAccount}, (error, transactionHash) => {
              if(error) {
                console.error(error);
              } else {
                this.setState({transactionHash});
              }
            });
            fileStoreForm.reset()
          }
          store();
        }       
      } catch (err) {
        alert(err.message + val[1])
        fileStoreForm.reset()
      }
    })
  }

  render () {
    return (
      <section id="store" className="p-5">
        <MetaTags>
          <title>Store - PoD</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta id="meta-description" name="description" content="Ethereum x IPFS DApp." />
          <meta id="og-title" property="og:title" content="Planet of Docs" />
        </MetaTags>

        <div className="container">
          <div className="justify-content-between">
            <div>
              <img src={StoreAsset} className="mx-auto d-block" alt="" width="20%" height="20%" />
            </div>

            <div className="px-3 d-flex align-items-center justify-content-center">
              <h1>Store File</h1>
            </div>

            <div className="px-3 pt-3 d-flex align-items-center justify-content-center">
              <p className="lead text-center">
                Complete the form and upload your file.<br />
                <span className="fs-6">
                <span className="fs-6 fw-bold">NOTE:</span> The 
                <span className="fs-6 fst-italic fw-bold"> Live Transaction Log </span> 
                section will be automatically updated after confirming transaction.</span>
              </p>
            </div>

            <hr />

            <div className="py-3 d-flex align-items-center justify-content-center">
              <h2>Account: {this.state.activeAccount}</h2>
            </div>

            {/* Live Transaction Log*/}

            <div className="pb-3">
              <h3>Live Transaction Log</h3>
              <table className="table table-striped table-hover">
                <thead>
                <tr>
                  <th scope="col" width="175">Property</th>
                  <th scope="col">Value</th>
                </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>File Name</td>
                    <td>{this.state.fileName}</td>
                  </tr>
                  <tr>
                    <td>IPFS Hash</td>
                    <td>{this.state.ipfsHash}</td>
                  </tr>
                  <tr>
                    <td>Tx Hash</td>
                    <td>{this.state.transactionHash}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* File Store Form */}

            <h3>File Store Form</h3>
            <div className="pb-3">
              <form name="fileStoreForm" onSubmit={this.storeFileToIpfs}>
                <div className="form-group files row mx-1">
                  <input className="form-control" id="formFile" type="file" onChange={this.captureFile} required/>
                </div>

                <div className="row mx-5 py-3">
                  <button type="submit" className="btn btn-outline-primary col-6 mx-auto">Store</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
      </section>
    );
  }
}

export default Store;