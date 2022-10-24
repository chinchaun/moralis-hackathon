import { useState, useEffect } from "react";
import useSWR from 'swr';
import { INFT } from "../../interfaces/INFT";

const getNFTBalancesFetcher = async (params: {
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
	
	const res = await fetch(url, request);
	const data = await res.json();
	if (data.result[0] && data.result[0].contract_type === "ERC1155") {
		const nftRes = await fetch(data.result[0].token_uri);
		const nftData = await nftRes.json();
		data.result[0].metadata = JSON.stringify(nftData);
	}
	return Promise.resolve(data);

	// return fetch(url, request).then((res) => res.json());
};

export const useGetNFT = () => {
	const [params, setParams] = useState<{
		address: string;
		chainId: string;
	}>();
	const [errorWrapper, setErrorWrapper] = useState<Error | any>();

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
			} else if (data.total === 0) {
				setErrorWrapper(new Error("EMPTY_WALLET"))
			}
			else {
				setNFT(undefined);
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			console.log({ error });
			setErrorWrapper(error);
		}
	}, [error]);

	return {
		data: nft,
		isLoading: !error && !nft,
		isError: error,
		error: errorWrapper,
		doGet: setParams,
	};
};