import type { NextPage } from 'next';
import { Layout} from 'antd';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import { NFT } from '../components/NFT/NFT';
import { initWeb3Onboard } from '../wallet/config';
import { useRouter } from 'next/router';

const { Content } = Layout;

const Home: NextPage = () => {

  const [web3Onboard, setWeb3Onboard] = useState<unknown>(null);
  const router = useRouter();

	useEffect(() => {
		setWeb3Onboard(initWeb3Onboard);
	}, []);

  return (
    <Layout className="layout">
      <Navbar />
      <Layout className="site-layout">
        <Content className="site-layout-background">
          {web3Onboard && router.isReady ? <NFT /> : <div> Loading </div>}
        </Content>
      </Layout>
    </Layout>
  )
}

export default Home
