var PlanetOfDocs = artifacts.require("./PlanetOfDocs.sol");

module.exports = function(deployer) {
  deployer.deploy(PlanetOfDocs);
};
