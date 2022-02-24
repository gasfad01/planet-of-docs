// Front-end
import React, { Component } from "react";
import MetaTags from 'react-meta-tags';

// UI
import 'bootstrap/dist/css/bootstrap.min.css';
import OwnershipAsset from "../assets/img/ownership.png";
import Table from "./Table";

// Contract
import getWeb3 from "../getWeb3";
import PlanetOfDocs from "../contracts/PlanetOfDocs.json";

// IPFS
import ipfs from '../ipfs';

class Ownership extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null, accounts: null, contract: null,
      activeAccount: 'Anonymous',
      buffer: '',
      hashToCheck: '',
      fileIds: null, fileNames: null, fileHashes: null,
      userFiles: [{
        id: 0,
        fileName: 'Unknown',
        fileHash: 'Unknown'
      }],
      userFilesLength: 0
    }
  }
  
  componentDidMount = async () => {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = PlanetOfDocs.networks[networkId];
    const instance = new web3.eth.Contract(PlanetOfDocs.abi,deployedNetwork && deployedNetwork.address,);
    this.setState({ web3, contract: instance})

    setInterval(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        this.setState({ accounts });

        if(this.state.activeAccount !== accounts[0]){
          var active = accounts[0];
          this.setState({activeAccount: active})
          this.setState({hashToCheck: ''})
          this.setState({fileIds: null})
          this.setState({fileNames: null})
          this.setState({fileHashes: null})
          this.state.contract.methods.getFilesByOwner(this.state.activeAccount).call((error, result) => {
            if(error){
              console.log(error)
            } else {
              this.setState({ fileIds: result })
              this.state.contract.methods.getOwnerFileDetails(this.state.activeAccount, this.state.fileIds).call((error, (fileNames, fileHashes) => {
                this.setState({fileNames: fileNames})
                this.setState({fileHashes: fileHashes})
                if(fileHashes !== null && Object.values(fileHashes)[0].length > 0) {
                  let userFiles = [];
                  for(let i = 0; i < Object.values(fileHashes)[0].length; i ++) {
                    let tempObject = {};
                    tempObject.id = i + 1;
                    tempObject.fileNames = Object.values(fileHashes)[0][i];
                    tempObject.fileHashes = Object.values(fileHashes)[1][i];
                    console.log(tempObject)
                    userFiles.push(tempObject);
                    this.setState({ userFiles: [...userFiles]})
                  }
                } else {
                  this.setState({userFiles: [{
                    id: 0,
                    fileNames: 'No Records',
                    fileHashes: 'No Records'
                  }]})
                } 
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

  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    this.setState({ fileToUpload:file })
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  }

  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result)
    this.setState({ buffer })
  }

  checkFileInIpfs = async (event) => {
    event.preventDefault();
    let content = this.state.fileToUpload
    this.setState({ fileName: content.name })

    let fileUploaded = await ipfs.files.add(this.state.buffer, {onlyHash:true})
    let hashToCheck = fileUploaded[0].hash
    this.setState({hashToCheck: hashToCheck})
    let checkOwnershipForm = document.getElementsByName("checkOwnershipForm")[0];

    this.state.contract.methods.checkFileExistByHash(this.state.hashToCheck).call(
    (error, val) => {
      if(error) {
        console.log(error)
      } 
      if(val[0]) {
        if(val[1] === this.state.activeAccount) {
          alert("Oops, you've stored this file. This file belongs to: " + val[1])
          checkOwnershipForm.reset()
        } else {
          alert("The file already exists and is stored in our IPFS and belongs to: " + val[1])
          checkOwnershipForm.reset()
        }
      } else {
        alert("Unique file, you can continue to store this file.")
        checkOwnershipForm.reset()
      }
    })
  }

  render () {
    return (
      <section id="Ownership" className="p-5">
        <MetaTags>
          <title>Ownership - PoD</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta id="meta-description" name="description" content="Ethereum x IPFS DApp." />
          <meta id="og-title" property="og:title" content="Planet of Docs" />
        </MetaTags>

        <div className="container">
          <div className="justify-content-between">
            <div>
              <img src={OwnershipAsset} className="mx-auto d-block" alt="" width="20%" height="20%" />
            </div>

            <div className="px-3 d-flex align-items-center justify-content-center">
              <h1>File Ownership</h1>
            </div>

            <div className="px-3 pt-3 d-flex align-items-center justify-content-center">
              <p className="lead text-center">
                Check for file ownership and list your files.<br />
                <span className="fs-6">
                <span className="fs-6 fw-bold">NOTE:</span> In 
                <span className="fs-6 fst-italic fw-bold"> Check File Ownership </span> 
                section, you can try to upload a file and we will match the hash with all the files stored on our IPFS.</span>
              </p>
            </div>

            <hr />

            <div className="py-3 d-flex align-items-center justify-content-center">
              <h2>Account: {this.state.activeAccount}</h2>
            </div>

            {/* Check File Ownership */}

            <h3>Check Ownership</h3>
            <div className="pb-3">
              <form name="checkOwnershipForm" onSubmit={this.checkFileInIpfs}>
                <div className="form-group files row mx-1">
                  <input className="form-control" id="formFile" type="file" onChange={this.captureFile} required/>
                </div>

                <div className="row mx-5 py-3">
                  <button type="submit" className="btn btn-outline-primary col-6 mx-auto">Check</button>
                </div>
              </form>
            </div>

            <hr />

            {/* Your Stored Files */}

            <h3>Your Stored Files</h3>
            <Table data={this.state.userFiles} rowsPerPage={30} />
            
          </div>
        </div>
        
      </section>
    );
  }
}

export default Ownership;