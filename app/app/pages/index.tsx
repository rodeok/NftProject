import {ChainId, ThirdwebNftMedia, useAddress,useContract,useDisconnect,useMetamask,useMintNFT,useNetwork,useNetworkMismatch,useNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Theme.module.css";
const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const {contract} = useContract("0x453F378f88369439A23c04A84bD77cDE4a09da42");
  const {data: nfts ,isLoading: isLoadingNfts} = useNFTs(contract?.nft)
  const {mutate: mintNft,isLoading: isMinting} = useMintNFT(contract?.nft)
  const isWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork()

  async function mintAnNft() {
    if (!address){
      connectWithMetamask()
      return;
    }
    if (isWrongNetwork) {
      switchNetwork?.(ChainId.Goerli)
      return;
    }
    mintNft(
      {
        metadata: {
          name: "favvy",
          image: "https://gateway.ipfscdn.io/ipfs/QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png"

        },
        to: address,
      },
      {
        onSuccess(data){
          alert(`🚀 Successfully Minted NFT!`);
        }
      }
    )
  }
  return (
    <div>
      <div>
        {address ? (
          <>
          <button onClick={disconnectWallet}>Disconnect Wallet 🚀</button>
          <p>Your address: {address}</p>
          {!isLoadingNfts ? (
                <div className={styles.nftBoxGrid}>
                {nfts?.map((nft)=>{
                  <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                    metadata={nft.metadata}
                    className={styles.nftMedia}
                    />
                    <h3>{nft.metadata.name}</h3>
                    <p>Owner: {nft.owner.slice(0,6)}</p>
                  </div>
                })}
                </div>
          ):(
             <p>Loading Nft..</p>
          )}
          <button onClick={mintAnNft} className={`${styles.mainButton} ${styles.spacerTop}`}>
            {isMinting ? "Minting..": "Mint Nft"}
          </button>
          </>
        ):(
          <button onClick={connectWithMetamask}> Connect with metamask 🚀</button>
        )}
      </div>
    </div>
  );
};

export default Home;
