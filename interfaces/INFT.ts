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
    contract_type: string;
}
