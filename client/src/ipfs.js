const IPFS = require('ipfs-api');

//const ipfs = new IPFS({host: 'localhost', port: 5001, protocol: 'http'});
//const ipfs = create('https://ipfs.infura.io:5001/api/v0')
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

export default ipfs;