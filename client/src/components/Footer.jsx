import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <div className="footer">
      <footer className="w-100 py-4 flex-shrink-0 bg-warning">
        <div className="container py-4">
            <div className="row gy-4 gx-5">
                <div className="col-lg-4 col-md-6">
                    <h5 className="h1 text-dark">Planet of Docs</h5>
                    <p className="small text-muted">Tugas Akhir S1 Teknik Komputer Telkom University, Implementation of Blockchain and Peer-to-Peer
                    Network for Digital Document Management.</p>
                    <p className="small text-muted mb-0">&copy; Copyrights All Rights Reserved 2021 by Gasfad.</p>
                </div>
                <div className="col-lg-3 col-md-6">
                    <h5 className="h1 text-dark">Quick links</h5>
                    <ul className="list-unstyled text-muted">
                        <li className="small text-muted"><a href="https://github.com/gasfad01" className="link-dark">Github</a></li>
                        <li className="small text-muted"><a href="https://twitter.com/gasfad01" className="link-dark">Twitter</a></li>
                        <li className="small text-muted"><a href="https://linkedin.com/in/bagasislamay" className="link-dark">LinkedIn</a></li>
                    </ul>
                </div>
                <div className="col-lg-5 col-md-6">
                    <h5 className="h1 text-dark">Newsletter</h5>
                    <p className="small text-muted">Sign up to receive updates, news and informations from us!</p>
                      <form action="#">
                          <div className="input-group mb-3">
                            <input className="form-control" type="text" placeholder="Recipient's email" aria-label="Recipient's email" aria-describedby="button-addon2" />
                            <button className="btn btn-primary" id="button-addon2" type="button">Submit</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
}

export default Footer;