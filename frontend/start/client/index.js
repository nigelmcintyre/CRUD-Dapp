import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    //Check if the latest verson of metamask has inserted itself into the browser
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    //Check if an older version of metamask has been inserted into the window
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    //No metamask use local truffle instance to interact with blockchain
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = () => {
  //Get abi and address from the build object of the crud smart contract
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(
    Crud.abi, 
    Crud
      .networks[deploymentKey]
      .address
  );
};

const initApp = () => {
  const $create = document.getElementById('create');
  const $createResult = document.getElementById('create-result');
  const $read = document.getElementById('read');
  const $readResult = document.getElementById('read-result');
  const $edit = document.getElementById('edit');
  const $editResult = document.getElementById('edit-result');
  const $delete = document.getElementById('delete');
  const $deleteResult = document.getElementById('delete-result');
  let accounts = [];
  web3.eth.getAccounts()
    .then(_accounts => {
      accounts = _accounts;
    });
  $create.addEventListener('submit', e => {
    //Prevents the page from reloading
    e.preventDefault();
    //Accessing value returned from the submit event
    const name = e.target.elements[0].value;
    //Calling contract instance
    crud.methods
      .create(name)
      //Sends a transaction to the blockchain to the account in the account array
      .send({from: accounts[0]})
      .then(() => {
        $createResult.innerHTML = `New user ${name} was successfully create`
      })
      .catch(() => {
        $createResult.innerHTML = 'Ooops there was an error when trying to create a new user'
      });
  });
  $read.addEventListener('submit', e => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods
      .read(id)
      //Use call function when only want to read from the blockchain and not sending a transaction.
      .call()
      .then(result => {
        $readResult.innerHTML = `User with ID:${result[0]} has the Name: ${result[1]}`;
      })
      .catch(() => {
        $readResult.innerHTML = `Error reading user ${id}`
      });
  });
  $edit.addEventListener('submit', e => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    crud.methods
      .update(id,name)
      .send({from: accounts[0]})
      .then(() => {
        $editResult.innerHTML = `Changed name of user${id} to ${name}`;
      })
      .catch(() => {
        $editResult.innerHTML = `Error updating user: ${id}`
      });
  });
  $delete.addEventListener('submit', e => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods
      .destroy(id)
      .send({from: accounts[0]})
      .then(() => {
        $deleteResult.innerHTML = `deleted user${id}`;
      })
      .catch(() => {
        $deleteResult.innerHTML = `Error deleting user: ${id}`
      });
  });

};
//Once page is loaded call above functionsr
document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      crud = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
