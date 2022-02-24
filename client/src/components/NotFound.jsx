import React, { Component } from "react";
import MetaTags from 'react-meta-tags';

// UI
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundAsset from "../assets/img/notfound.png";

class NotFound extends Component {
    render () {
      return (
        <section id="Destruct" className="p-5">
          <MetaTags>
            <title>Not Found - PoD</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta id="meta-description" name="description" content="Ethereum x IPFS DApp." />
            <meta id="og-title" property="og:title" content="Planet of Docs" />
          </MetaTags>
  
          <div className="container">
            <div className="justify-content-between">
              <div>
                <img src={NotFoundAsset} className="mx-auto d-block" alt="" width="20%" height="20%" />
              </div>
  
              <div className="px-3 d-flex align-items-center justify-content-center">
                <div>
                    <h1 className="text-center">404 - Not Found</h1><br />
                    <h3 className="text-center">Just an empty space on our Universe.</h3>
                </div>
                
              </div>
              
            </div>
          </div>
          
        </section>
      );
    }
  }

export default NotFound;