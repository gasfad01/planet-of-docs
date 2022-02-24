// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StoreFile.sol";

contract GetFile is StoreFile {
  function getFilesByOwner(address _owner) public view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerFileCount[_owner]);
    uint counter = 0;
    for(uint i = 0; i < files.length; i++) {
      if(fileToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getOwnerFileDetails(address _owner, uint[] memory fileIds) public view returns(string[] memory, string[] memory) {
    string[] memory fileNames = new string[](ownerFileCount[_owner]);
    string[] memory fileHashes = new string[](ownerFileCount[_owner]);
    for(uint i = 0; i < fileIds.length; i++) {
      uint fileId = fileIds[i];
      fileNames[i] = fileToName[fileId];
      fileHashes[i] = fileToHash[fileId];
    }
    return (fileNames, fileHashes);
  }

  function checkFileExistByHash(string memory _fileHash) public view returns(bool, address) {
    bool isExist = false;
    address owner;
    for(uint i = 0; i < files.length; i++) {
      if(keccak256(abi.encodePacked(fileToHash[i])) == keccak256(abi.encodePacked(_fileHash))){
        isExist = true;
        owner = fileToOwner[i];
        return (isExist, owner);
      }
    }
    return (isExist, owner);
  }

  function getFileIdByHash(string memory _fileHash) public view returns(uint, bool) {
    bool isExist = false;
    for(uint i = 0; i < files.length; i++) {
      if(keccak256(abi.encodePacked(fileToHash[i])) == keccak256(abi.encodePacked(_fileHash))){
        isExist = true;
        return (i, isExist);
      }
    }
    uint id = files.length;
    return(id, isExist);
  }
}