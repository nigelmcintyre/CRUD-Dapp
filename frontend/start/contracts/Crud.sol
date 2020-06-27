pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/AccessControl.sol';

contract Crud is AccessControl{

  // bytes32 public constant USER_ROLE = keccak256("USER");

  // /// @dev Add `root` to the admin role as a member.
  // constructor (address root) public {
  //     _setupRole(DEFAULT_ADMIN_ROLE, root);
  //     _setRoleAdmin(USER_ROLE, DEFAULT_ADMIN_ROLE);
  // }

  // /// @dev Restricted to members of the admin role.
  // modifier onlyAdmin() {
  //     require(isAdmin(msg.sender), "Restricted to admins.");
  //     _;
  // }

  // /// @dev Return `true` if the account belongs to the admin role.
  // function isAdmin(address account) public virtual view returns (bool) {
  //     return hasRole(DEFAULT_ADMIN_ROLE, account);
  // }



  struct User {
    uint id;
    string name;
  }
  User[] public users;
  uint public nextId = 1;

  function create(string memory name) public {
    users.push(User(nextId, name));
    nextId++;
  }

  function read(uint id) view public returns(uint, string memory) {
    uint i = find(id);
    return(users[i].id, users[i].name);
  }

  function update(uint id, string memory name) public {
    uint i = find(id);
    users[i].name = name;
  }

  function destroy(uint id) public {
    uint i = find(id);
    delete users[i];
  }

  function find(uint id) view internal returns(uint) {
    for(uint i = 0; i < users.length; i++) {
      if(users[i].id == id) {
        return i;
      }
    }
    revert('User does not exist!');
  }

}
