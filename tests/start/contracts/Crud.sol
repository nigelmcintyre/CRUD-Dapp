pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Crud is AccessControl{

  bytes32 public constant PATIENT_ROLE = keccak256("PATIENT");
  bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR");
  address root = msg.sender;

  /// @dev Add `root` to the admin role as a member.
  constructor () public {
      _setupRole(DEFAULT_ADMIN_ROLE, root);
      _setRoleAdmin(DOCTOR_ROLE, DEFAULT_ADMIN_ROLE);
  }

  /// @dev Restricted to members of the admin role.
  modifier onlyAdmin() {
      require(isAdmin(msg.sender), "Restricted to admins.");
      _;
  }

      /// @dev Return `true` if the account belongs to the admin role.
  function isAdmin(address account) public virtual view returns (bool) {
      return hasRole(DEFAULT_ADMIN_ROLE, account);
  }

  /// @dev Restricted to members of the user role.
  modifier onlyDoctor() {
      require(isDoctor(msg.sender), "Restricted to Doctors.");
      _;
  }

  /// @dev Return `true` if the account belongs to the user role.
  function isDoctor(address account) public virtual view returns (bool) {
      return hasRole(DOCTOR_ROLE, account);
  }

  /// @dev Return `true` if the account belongs to the user role.
  function isPatient(address account) public virtual view returns (bool) {
      return hasRole(PATIENT_ROLE, account);
  }

  /// @dev Add an account to the user role. Restricted to admins.
  function addDoctor(address account) public virtual onlyAdmin {
      grantRole(DOCTOR_ROLE, account);
  }

  /// @dev Add an account to the user role. Restricted to admins.
  function addPatient(address account) public virtual onlyAdmin {
      grantRole(PATIENT_ROLE, account);
  }

  /// @dev Add an account to the admin role. Restricted to admins.
  function addAdmin(address account) public virtual onlyAdmin {
      grantRole(DEFAULT_ADMIN_ROLE, account);
  }

  struct Patient {
    uint id;
    string name;
    address account;
  }

  struct Doctor {
    uint id;
    string name;
    address account;
  }
  Patient[] public patients;
  uint public nextId = 1;

  function create(string memory name, address account) public onlyDoctor {      
    patients.push(Patient(nextId, name, account));
    nextId++;
    grantRole(PATIENT_ROLE, account);
  } 

  function read(uint id) view public returns(uint, string memory, address) {
    uint i = find(id);
    return(patients[i].id, patients[i].name, patients[i].account);
  }

  function update(uint id, string memory name) public {
    uint i = find(id);
    patients[i].name = name;
  }

  function destroy(uint id) public {
    uint i = find(id);
    delete patients[i];
  }

  function find(uint id) view internal returns(uint) {
    for(uint i = 0; i < patients.length; i++) {
      if(patients[i].id == id) {
        return i;
      }
    }
    revert('Patient does not exist!');
  }

}
