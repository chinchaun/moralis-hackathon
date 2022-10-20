import { init } from "@web3-onboard/react";
import injectedModule, { ProviderLabel } from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";

const injected = injectedModule({
	filter: {
		[ProviderLabel.Binance]: false,
	},
});
const walletConnect = walletConnectModule();
const wallets = [injected, walletConnect];

export const chainId = "0x13881";

export const initWeb3Onboard = init({
	wallets,
	chains: [{
        id: chainId,
        token: "MATIC",
        label: "Polygon - Mumbai",
        rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/3-a9FcqrP5kJGLoFKbiRcxVd5GSUMHFb",
        }],
	appMetadata: {
		name: "Pied Piper Money",
		icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
		logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
		description: "Pied Piper Money",
		recommendedInjectedWallets: [
			{ name: "MetaMask", url: "https://metamask.io" },
		],
	},
	accountCenter: {
		desktop: {
			position: "topRight",
			enabled: true,
			minimal: false,
		},
		mobile: {
			position: "topRight",
			enabled: true,
			minimal: false,
		},
	},
	apiKey: process.env.NEXT_PUBLIC_BLOCK_NATIVE_APP_ID,
});
