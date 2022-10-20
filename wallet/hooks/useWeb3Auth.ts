import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { SafeEventEmitterProvider } from "@web3auth/base";

export const useWeb3Auth = () => {
    const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

    if (!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID) {
      throw new Error('Missing Web3Auth Client Id');
    }

    const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

    useEffect(() => {
      const init = async () => {
        try {
        console.log("chainid: " +  process.env.NEXT_PUBLIC_POLYGON_RPC_URL);
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x13881", // hex of 80001, polygon testnet
            rpcTarget: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
            displayName: "Polygon Testnet",
            blockExplorer: "https://mumbai.polygonscan.com/",
            ticker: "MATIC",
            tickerName: "Matic",
          },
        });
  
        setWeb3auth(web3auth);
  
        await web3auth.initModal();
          if (web3auth.provider) {
            setProvider(web3auth.provider);
          };
        } catch (error) {
          console.error(error);
        }
      };
  
      init();
    }, []);
  
    const login = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
    };
  
    const getUserInfo = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const user = await web3auth.getUserInfo();
      console.log(user);
    };
  
    const logout = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      await web3auth.logout();
      setProvider(null);
    };

    return { login, logout, getUserInfo, isLoading: !web3auth, provider };
}