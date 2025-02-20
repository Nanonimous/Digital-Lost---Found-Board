// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LostAndFound {
    struct Item {
        uint id;
        address owner;
        string description;
        string imageHash;  // IPFS hash for image recognition
        bool isFound;
        uint reward;
    }

    uint private itemCounter;
    mapping(uint => Item) public items;
    mapping(address => uint[]) public userItems;

    event ItemReported(uint indexed itemId, address indexed owner, string description, uint reward);
    event ItemClaimed(uint indexed itemId, address indexed claimant);

    modifier onlyOwner(uint itemId) {
        require(msg.sender == items[itemId].owner, "Not authorized!");
        _;
    }

    function reportLostItem(string memory _description, string memory _imageHash, uint _reward) public {
        itemCounter++;
        items[itemCounter] = Item(itemCounter, msg.sender, _description, _imageHash, false, _reward);
        userItems[msg.sender].push(itemCounter);

        emit ItemReported(itemCounter, msg.sender, _description, _reward);
    }

    function reportFoundItem(uint _itemId) public {
        require(items[_itemId].owner != address(0), "Item does not exist!");
        require(!items[_itemId].isFound, "Item already found!");

        items[_itemId].isFound = true;
        emit ItemClaimed(_itemId, msg.sender);
    }

    function claimReward(uint _itemId) public onlyOwner(_itemId) {
        require(items[_itemId].isFound, "Item is not found yet!");
        require(items[_itemId].reward > 0, "No reward available!");

        payable(msg.sender).transfer(items[_itemId].reward);
        items[_itemId].reward = 0;  // Reset reward after claiming
    }

    function getItem(uint _itemId) public view returns (Item memory) {
        return items[_itemId];
    }

    receive() external payable {} // Allows contract to receive funds for rewards
}