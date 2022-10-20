import { useState, useEffect } from "react";
import useSWR from 'swr';

const getNFTBalancesFetcher = (params: {
	address: string;
	chainId: string;
}) => {
	const { address, chainId } = params;

	if (!process.env.NEXT_PUBLIC_MORALIS_API_KEY) {
		throw new Error("Missing Moralis API Key");
	}
	const request: RequestInit = {
		headers: {
			accept: "application/json",
			"X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
		},
	};
	const url =
		`https://deep-index.moralis.io/api/v2/${address}/nft?` +
		new URLSearchParams({ chain: chainId, format: "decimal" });
	return fetch(url, request).then((res) => res.json());
};

export interface INFT {
	metadata: {
		name: string;
		description: string;
		image: string;
		external_url?: string;
	};
	name: string;
	symbol: string;
	token_id: string;
	token_uri: string;
	token_address: string;
}

export const useGetNFT = () => {
	const [params, setParams] = useState<{
		address: string;
		chainId: string;
	}>();

	const { data, error } = useSWR(
		params
			? {
					address: params.address,
					chainId: params.chainId,
			  }
			: null,
		getNFTBalancesFetcher
	);
	const [nft, setNFT] = useState<INFT>();

	useEffect(() => {
		if (data) {
			if (data.total >= 1 && data.status === "SYNCED") {
				const metadata = JSON.parse(data.result[0].metadata);
				setNFT({ ...data.result[0], metadata });
			} else {
				setNFT(undefined);
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			console.log({ error });
		}
	}, [error]);

	return {
		data: nft,
		isLoading: !error && !nft,
		isError: error,
		doGet: setParams,
	};
};