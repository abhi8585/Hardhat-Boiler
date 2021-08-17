import React from "react";
import { ConnectWallet } from "./ConnectWallet";
import { ethers } from "ethers";
// / We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/Token.json";
import contractAddress from "../contracts/contract-address.json";

// Import the MyCollectible contract's artifacts and address here

import MyCollectible from "../contracts/MyCollectible.json";
import myColletibleAddress from "../contracts/mycollectible-address.json";

export class ShoppingList extends React.Component {


    constructor(props) {
        super(props);
    
        // We store multiple things in Dapp's state.
        // You don't need to follow this pattern, but it's an useful example.
        this.initialState = {
          // The info of the token (i.e. It's Name and symbol)
          tokenData: undefined,
          // The user's address and balance
          selectedAddress: undefined,
          balance: undefined,
          // The ID about transactions being sent, and any possible error with them
          txBeingSent: undefined,
          transactionError: undefined,
          networkError: undefined,
        };
    
        this.state = this.initialState;
      }


    //   responsible for connecting the application to metamask wallet.

      async _connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.
    
        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.enable();
        console.log(selectedAddress)
        // Once we have the address, we can initialize the application.

        this._initialize(selectedAddress);
      }


        // This method just clears part of the state.
    _dismissNetworkError() {
        this.setState({ networkError: undefined });
    }


    // Function responsible for getting the contract information such as token name and token symbol.

    async _getTokenData() {
        const name = await this._token.name();
        const symbol = await this._token.symbol();
        console.log([name, symbol])
        this.setState({ tokenData: { name, symbol } });
      }

    
    async _getCollectibleData() {
        const name = await this._myCollectible.name();
        const symbol = await this._myCollectible.symbol();
        console.log([name, symbol])
        this.setState({ tokenData: { name, symbol } });
    }


    async _mintItem(to, tokenId){
        console.log([to, tokenId]);
        const mintedID = await this._myCollectible.mint(to, tokenId);
    }
    // responsible for setting up the user account address and get the smart contrat information.
    _initialize(userAddress) {
        // This method initializes the dapp
    
        // We first store the user's address in the component's state
        this.setState({
          selectedAddress: userAddress,
        });
    
        // Then, we initialize ethers, fetch the token's data, and start polling
        // for the user's balance.
    
        // Fetching the token data and the user's balance are specific to this
        // sample project, but you can reuse the same initialization pattern.
        this._intializeEthers();
        this._getTokenData();
        this._getMyCollectible();
        this._getCollectibleData();
        this._mintItem(this.state.selectedAddress, 2)
        // console.log("Minted Item!!")
        // this._startPollingData();
      }

    // Function responsible for fetching the smart contrat information
    async _intializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);
    
        // When, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        this._token = new ethers.Contract(
          contractAddress.Token,
          TokenArtifact.abi,
          this._provider.getSigner(0)
        );
      }

      // Function responsible for fetching the smart contract information Mintable
      async _getMyCollectible() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);
    
        // When, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        this._myCollectible = new ethers.Contract(
          myColletibleAddress.Token,
          MyCollectible.abi,
          this._provider.getSigner(0)
        );
        console.log(this._myCollectible);
      }

    render() {
      return (
        <div className="shopping-list">
          <h1>Shopping List for {this.props.name}</h1>
          <ul>
            <li>Instagram</li>
            <li>WhatsApp</li>
            <li>Oculus</li>
            <li><ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        /></li>
          </ul>
        </div>
      );
    }
  }