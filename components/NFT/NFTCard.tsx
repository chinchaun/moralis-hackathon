import { Button, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useConnectWallet } from "@web3-onboard/react";
import { useGetNFT } from '../../wallet/hooks/useGetNFT';
import { chainId, jsonRPCProviderInstance } from '../../wallet/config';
import { useRouter } from 'next/router';
import { Wallet, ethers } from "ethers";
import { useWeb3Auth } from '../../wallet/hooks/useWeb3Auth';
import { DiscordIcon, GoogleIcon, MetaMaskIcon, TwitchIcon } from '../Icons/CustomIcons';
import { useClaimNFT } from '../../wallet/hooks/useClaimNFT';
import { INFT } from '../../interfaces/INFT';

const { Meta } = Card;
const { Text } = Typography;

const ConnectWalletButton = () => {
  const [_, connect] = useConnectWallet();
  const connectWalletOnClick = async () => {
    await connect();
  };

  return (
    <Button className='button-gradient' icon={<MetaMaskIcon />} onClick={connectWalletOnClick} type='primary' size='large'> Connect your Wallet to withdraw the NFT </Button>
  )
};

const WithdrawToWallet = (props: { onClick: () => void; isLoading: boolean; }) => {

  return (
    <Button loading={props.isLoading} onClick={props.onClick} className='button-gradient' type='primary' size='large'> Claim NFT</Button>
  )
}

const getNFTImage = (nft: INFT) => {
  if (nft.contract_type && nft.contract_type === "ERC1155") {
    return nft.metadata.image;
  } else if (nft.metadata.external_url) {
    return `https://ipfs.io/ipfs/${nft.metadata.image.split("ipfs://ipfs/").slice(-1)[0]
      }`;
  } else {
    return `https://ipfs.io/ipfs/${nft.metadata.image.split("ipfs://").slice(-1)[0]
      }`;
  }
};

const Web2Login = (props: { onClick: () => void; }) => {
  return (
    <Button className='button-gradient' size="large"
      style={{ left: "50%", top: "5%", position: "relative", transform: "translate(-50%,-50%)", width: "355px" }}
      type="primary"
      onClick={props.onClick}>
      <> <TwitchIcon /> <DiscordIcon /> <GoogleIcon /> Log In To withdraw your NFT </>
    </Button>
  )
}

export const NFTCard = (props: { onClaimed: () => void }) => {
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
  const claimNFT = useClaimNFT();

  useEffect(() => {
    setPageWallet(pageWallet.connect(jsonRPCProviderInstance));
  }, []);

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

  useEffect(() => {
    if (!claimNFT.data) {
      return;
    }
    props.onClaimed();

  }, [claimNFT.data]);

  useEffect(() => {
    console.log({ error: getNFT.error });
    if (getNFT.error instanceof Error && getNFT.error.message === "EMPTY_WALLET") {
      props.onClaimed();
    }
  }, [getNFT.error]);


  const onClaimClick = () => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }
    if (!getNFT.data) {
      throw new Error("This Wallet doesn't hold any NFT");
    }

    claimNFT.doClaim({
      nft: getNFT.data,
      fromWallet: pageWallet,
      toAddress: wallet.accounts[0].address
    });
  }

  const getCardButton = () => {
    return wallet ? <WithdrawToWallet isLoading={claimNFT.isLoading} onClick={onClaimClick} /> : <ConnectWalletButton />;
  }

  const login = async () => {
    await web3Auth.login();
  }

  return (
    <>
      <Card
        loading={getNFT.isLoading}
        style={{
          width: 400,
          left: "50%", top: "40%", position: "relative", transform: "translate(-50%,-50%)"

        }}
        cover={getNFT.data ?
          <Image
            width="400"
            height="400"
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
      {!web3Auth.isLoading && !getNFT.isLoading && !wallet &&
        <Web2Login onClick={login} />
      }
      {/* <div style={{ left: "50%", top: "20%", position: "relative", transform: "translate(-50%,-50%)", width: "290px" }}>
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
      </div> */}

      {/* {!web3Auth.isLoading && <Button style={{
          left: "50%", top: "12%", position: "relative", transform: "translate(-50%,-50%)"

        }} type="primary" size="large" onClick={send}> userInfo </Button>} */}
    </>
  )
}