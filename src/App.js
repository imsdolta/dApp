import { ethers } from 'ethers';
import React, { useState } from 'react';
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json';

import './App.css';

function App() {
    const [greeting, setGreetingValue] = useState('');

    // Enter your account address here
    const greeterAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

    // ask to connect metamask account
    const requestUserAccount = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    };
    const fetchGreeting = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(
                greeterAddress,
                Greeter.abi,
                provider
            );
            try {
                const greeting = await contract.greet();
                console.log('Data is ', greeting);
            } catch (error) {
                console.log('Error', error);
            }
        }
    };
    const setGreeting = async () => {
        if (!greeting) {
            console.log('Provide a greeting first');
            return;
        }
        if (typeof window.ethereum !== 'undefined') {
            await requestUserAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                greeterAddress,
                Greeter.abi,
                signer
            );
            const transaction = await contract.setGreeting(greeting);
            await transaction.wait();
            fetchGreeting();
        }
    };
    return (
        <div className='App'>
            <header className='App-header'>
                <button onClick={fetchGreeting}>Fetch Greeting</button>
                <button onClick={setGreeting}>Set Greeting</button>
                <input
                    onChange={(e) => setGreetingValue(e.target.value)}
                    placeholder='Set greeting'
                />
            </header>
        </div>
    );
}

export default App;
