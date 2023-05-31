import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ISTEContract from "./ISTE.json";

function App() {
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transferHistory, setTransferHistory] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setSenderAddress(window.web3.eth.defaultAccount);
        } catch (error) {
          console.log(error);
        }
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        setSenderAddress(window.web3.eth.defaultAccount);
      } else {
        console.log("No web3 detected.");
      }
    };

    initWeb3();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const contractAddress = '0x66DaA021242930549eA83d6AF5c3De554033E2E6';
    const ISTE = new web3.eth.Contract(ISTEContract, contractAddress);

    const sender = senderAddress;
    const recipient = recipientAddress;
    const value = web3.utils.toWei(amount, "ether");
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    try {
      const tx = await ISTE.methods.transfer(recipient, value).send({ from: fromAddress });
      console.log(tx);

      const transfer = {
        from: fromAddress,
        to: recipient,
        amount
      };
      setTransferHistory([...transferHistory, transfer]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="">
      <div className="  ">
      <h1 className="">🚀 Web.Sol</h1>
      </div>
      <div className="">
      <h2 className="" >
        Send ISTE Tokens
        </h2>
      </div>
      </div>
      <div className="">
      <form onSubmit={handleSubmit} className="">
      <div className="">
        <label className="" htmlFor="recipient">
          🏠 Recipient Address:
        </label>
        </div>
        <div className=" ">
        <input
          className="  "
          placeholder="Enter Address"
          type="text"
          id="recipient"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          required
        />
        </div>
        <div className="">
        <label className="" htmlFor="amount">
          💲 Amount of Tokens:
        </label>
        </div>
        <div className=" ">
        <input
          className=" "
          placeholder="Enter tokens"
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        </div>
        <div className=" ">
        <button className="">
          Send Tokens 🛫
        </button>
        </div>
      </form>
      </div>
      {transferHistory.length > 0 && (
        <div className="">
          <table className="">
            <thead>
              <tr>
                <th className="">From</th>
                <th className="">To</th>
                <th className="">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transferHistory.map((transfer) => (
                <tr key={transfer.hash}>
                  <td className="">{transfer.from}</td>
                  <td className="">{transfer.to}</td>
                  <td className="">{transfer.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
}

export default App;

