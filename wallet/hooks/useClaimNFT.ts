import { Wallet, ethers, ContractInterface, Contract } from "ethers";
import { useEffect, useState } from "react";
import { INFT } from "../../interfaces/INFT";
import { ERC1155ABI, ERC721ABI } from "../config";

export const useClaimNFT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState();

  const [params, setParam] = useState<{
    nft: INFT;
    fromWallet: Wallet;
    toAddress: string;
  }>();

  useEffect(() => {
    if (!params) {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const doClaim = async () => {
      const contract = getContract(params.nft, params.fromWallet);

      let trx;
      try {
        const tx = await getTransferFn({
          nft: params.nft,
          contract,
          fromWallet: params.fromWallet,
          toAddress: params.toAddress,
        });

        trx = await tx.wait();
        if (trx.status !== 1) {
          console.log({ trx });
          throw new Error(`The transaction failed, hash: ${trx.hash}`);
        } else {
          setData(trx);
        }
      } catch (e) {
        console.log("sendContractFailed");
        console.log({ e });
        throw e;
      } finally {
        setIsLoading(false);
      }
    };

    doClaim();
  }, [params]);

  const getContract = (nft: INFT, fromWallet: Wallet) => {
    if (nft.contract_type === "ERC1155") {
      return new ethers.Contract(
        nft.token_address,
        ERC1155ABI as ContractInterface,
        fromWallet as any
      );
    } else if (nft.contract_type === "ERC721") {
      return new ethers.Contract(
        nft.token_address,
        ERC721ABI as ContractInterface,
        fromWallet as any
      );
    } else {
      throw new Error("Contract Type not supported");
    }
  };

  const getTransferFn = (params: {
    nft: INFT;
    contract: Contract;
    fromWallet: Wallet;
    toAddress: string;
  }) => {
    if (params.nft.contract_type === "ERC1155") {
      return params.contract.safeTransferFrom(
        params.fromWallet.address,
        params.toAddress,
        params.nft.token_id,
        1,
        []
      );
    } else if (params.nft.contract_type === "ERC721") {
      return params.contract.transferFrom(
        params.fromWallet.address,
        params.toAddress,
        params.nft.token_id
      );
    } else {
      throw new Error("Contract Type not supported");
    }
  };

  return { doClaim: setParam, isLoading, isError, data };
};
