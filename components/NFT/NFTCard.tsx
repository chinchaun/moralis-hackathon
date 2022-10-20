import { Button, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useConnectWallet } from "@web3-onboard/react";
import { INFT, useGetNFT } from '../../wallet/hooks/useGetNFT';
import { chainId } from '../../wallet/config';
import { useRouter } from 'next/router';
import { Wallet, ethers } from "ethers";
import { useWeb3Auth } from '../../wallet/hooks/useWeb3Auth';
import { DiscordIcon, GoogleIcon, MetaMaskIcon, MoralisIcon, PolygonIcon, TwitchIcon } from '../Icons/CustomIcons';

const { Meta } = Card;
const { Text, Title } = Typography;

const ConnectWalletButton = () => {
  const [_, connect] = useConnectWallet();
  const connectWalletOnClick = async () => {
    await connect();
  };

  return (
    <Button icon={<MetaMaskIcon />} onClick={connectWalletOnClick} type='primary' size='large'> Connect your Wallet to withdraw the NFT </Button>
  )
};

const WithdrawToWallet = () => {

  return (
    <Button type='primary' size='large'> Claim NFT</Button>
  )
}

export const getNFTImage = (nft: INFT) => {
  if (nft.metadata.external_url) {
    return `https://ipfs.io/ipfs/${nft.metadata.image.split("ipfs://ipfs/").slice(-1)[0]
      }`;
  } else {
    return `https://ipfs.io/ipfs/${nft.metadata.image.split("ipfs://").slice(-1)[0]
      }`;
  }
};

export const NFTCard = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [jsonLink] = useState<{ mnemonic: string, chainId: string }>(
    JSON.parse(Buffer.from(slug as string, "base64").toString("utf8"))
  );
  const [{ wallet }] = useConnectWallet();
  const [pageWallet, setPageWallet] = useState<Wallet>(ethers.Wallet.fromMnemonic(jsonLink.mnemonic));
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>();
  const web3Auth = useWeb3Auth();
  const getNFT = useGetNFT();

  useEffect(() => {
    if (!pageWallet) {
      return;
    }
    getNFT.doGet({ address: pageWallet.address, chainId: chainId });
  }, [pageWallet]);

  useEffect(() => {
    if (!web3Auth.provider) {
      return;
    }
    setProvider(new ethers.providers.Web3Provider(web3Auth.provider));
  }, [web3Auth.provider]);

  const send = async () => {
    // const accounts = await provider.listAccounts();
    // console.log({ accounts });
    if (!provider) {
      return;
    }

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    console.log({ address });

    try {
      const balance = await provider.getBalance("0x43d31b261ff42Ab45B2bD5eCF544a53D9f9359bD");
      // console.log({ balance: balance.toString() });
      // const signer = provider.getSigner();
      // const tx = await signer.sendTransaction({
      //   to: "0xfCCd45316821613C22F4B17081790b6FcE9db2ba",
      //   value: ethers.utils.parseEther("0.04"),
      // });

      // const trx = await tx.wait();
      // console.log({ trx });
      // return trx;
    } catch (e) {
      console.log("error plain");
      throw e;
    }
  }

  const getCardButton = () => {
    return wallet ? <WithdrawToWallet /> : <ConnectWalletButton />;
  }

  const login = async () => {
    await web3Auth.login();
  }

  const userInfo = async () => {
    await web3Auth.getUserInfo();
  }

  return (
    <>
      <Card
        loading={getNFT.isLoading}
        style={{
          width: 400,
          left: "50%", top: "30%", position: "relative", transform: "translate(-50%,-50%)"

        }}
        cover={getNFT.data ?
          <Image
            width="400"
            height="242"
            alt="example"
            src={getNFTImage(getNFT.data)}
          /> :
          ""
        }
        actions={[
          getCardButton()
        ]}
      >
        <Meta
          title={getNFT.data?.metadata.name}
          description={<> <Text> {getNFT.data?.name} </Text> </>}
        />
      </Card>
      {!web3Auth.isLoading && <Button size="large"
        style={{ left: "50%", top: "12%", position: "relative", transform: "translate(-50%,-50%)", width: "355px" }}
        type="primary" onClick={login}><> <TwitchIcon /> <DiscordIcon /> <GoogleIcon /> Log In To withdraw your NFT </></Button>}
      <div style={{ left: "50%", top: "20%", position: "relative", transform: "translate(-50%,-50%)", width: "290px" }}>
        <Title level={5}>
          <> <MoralisIcon /> </>
        </Title>
        <div style={{
          marginLeft: "35px",
          marginTop: "-32px"
        }}>
        <Title level={5}>
          <> Built on <PolygonIcon /> </>
        </Title>
        </div>
      </div>

      {/* {!web3Auth.isLoading && <Button style={{
          left: "50%", top: "12%", position: "relative", transform: "translate(-50%,-50%)"

        }} type="primary" size="large" onClick={send}> userInfo </Button>} */}
    </>
  )
}