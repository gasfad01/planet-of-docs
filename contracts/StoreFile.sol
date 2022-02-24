// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Storage.sol";
import "./safemath.sol";

contract StoreFile is Storage {
  using SafeMath for uint256;

  event StoreFileEvent(
    string name,
    string fileHash,
    address indexed owner,
    uint storeDate
  );

  function Store(string memory _name, string memory _fileHash, address _owner) public {
    bool isExist = false;
    address owner;

    // Check if there is the same file already recorded on the blockchain
    for(uint i = 0; i < files.length; i++) {
      if(keccak256(abi.encodePacked(fileToHash[i])) == keccak256(abi.encodePacked(_fileHash))){
        isExist = true;
        owner = fileToOwner[i];
      }
    }

    // If same file exist, then:
    if(isExist == true) {
      revert('File already exist');
    } else {
      // If file is unique then check the owner
      // Owner can't store same file multiple times
      if(owner == _owner) {
        revert('File already exist');
      } else {
        // Finally if everything si clear then proceed
        uint _storeDate = block.timestamp;
        files.push(File(_name, _fileHash, _owner, _storeDate));
        uint id = files.length - 1;
        fileToOwner[id] = msg.sender;
        fileToHash[id] = _fileHash;
        fileToName[id] = _name;
        ownerFileCount[msg.sender] = ownerFileCount[msg.sender].add(1);
        emit StoreFileEvent(_name, _fileHash, _owner, _storeDate);
      }
    }
  }
}