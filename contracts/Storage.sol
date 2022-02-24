// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/** 
 * @title Planet of Docs
 * @author Bagas Fadillah Islamay
 * @notice Manage files with IPFS data storing
 * @dev This contract might be buggy
 * @custom:experimental This is an experimental contract, Tugas Akhir!
 */

import "./ownable.sol";
import "./safemath.sol";

contract Storage is Ownable{
  /**
   * @dev Base contract
   */
  
  struct File {
    string name;
    string fileHash;
    address owner;
    uint256 storeDate;
  }

  // Array of files struct
  File[] public files;

  // Map file to owner
  mapping (uint => address) internal fileToOwner;
  // Map file to hash
  mapping (uint => string) internal fileToHash;
  // Map file to name
  mapping (uint => string) internal fileToName;
  // The number of files owned by the owner
  mapping (address => uint) internal ownerFileCount;
 

  modifier ownerOfFile(uint _fileId) {
    /**
     * @dev Modifier to check that only owner that can alter the file's info
     * Act as an anti-IDOR mechanism
     * Reference: Refactoring Common Logic from CZ-L4-C6
     */
    require(msg.sender == fileToOwner[_fileId]);
    _;
  }
}