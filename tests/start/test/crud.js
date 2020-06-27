const { assert } = require("console");
const { expectRevert } = require('@openzeppelin/test-helpers');

const Crud = artifacts.require('Crud');


contract('Crud', (accounts) => {
    let crud = null;
    const root = accounts[0];
    const user = accounts[1];
    console.log(accounts[0]);
    console.log(accounts[1]);
    console.log(accounts[2]);
    

    // this is executed before each test and is needed in each test
    before(async() => {
        crud = await Crud.deployed();
    });
    it('Should add account to Doctor', async () => {
        await crud.addDoctor(accounts[1]);
        console.log( await crud.isDoctor(accounts[1]));
        assert(await crud.isDoctor(accounts[1]) === true);
``
    });
    it('Should make doctor account an admin', async () => {
        await crud.addAdmin(accounts[1]);
        console.log( await crud.isAdmin(accounts[1]));
        assert(await crud.isAdmin(accounts[1]) === true);
``
    });

    it('Should create a new user', async () => {
        await crud.create('Frank', accounts[2], {from: accounts[1]});
        const user = await crud.read(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'Frank');
        assert(user[2] === accounts[1]);
    });

    it('create patient throws if not called by an admin account.', async () => {
        await expectRevert(
            crud.create('Alex', accounts[2], {from: accounts[3]} ),
            'Restricted to Doctors.',
        );
    });

    it('Should update a user', async () => {
        await crud.update(1,'Frankk');
        const user = await crud.read(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'Frankk');
    });
    it('Should not update a non-existing user', async () => {
        try {
            await crud.update(2,'Frankkk');
        } catch (e) {
            assert(e.message.includes('User does not exist!'));
            return;
        }
        assert(false);
    });
    it('Should destroy a user', async () => {
        await crud.destroy(1);
        try {
            await crud.read(1);
        } catch (e) {
            assert(e.message.includes('User does not exist!'));
            return;
        }
        assert(false);
    });
    it('Should not destroy a non-existing user', async () => {
        try {
            await crud.destroy(10);
        } catch (e) {
            assert(e.message.includes('User does not exist!'));
            return;
        }
        assert(false);
    });
});


