// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GetFile.sol";
import "./safemath.sol";

contract FileOwnership is GetFile {
  using SafeMath for uint256;

  function _transfer(address _from, address _to, uint256 _tokenId) public {
    require(fileToOwner[_tokenId] == msg.sender);
    ownerFileCount[_to] = ownerFileCount[_to].add(1);
    ownerFileCount[_from] = ownerFileCount[_from].sub(1);
    fileToOwner[_tokenId] = _to;
  }
}