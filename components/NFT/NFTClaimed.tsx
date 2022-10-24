import { Typography } from "antd";
import { useEffect } from "react";
import { useReward } from 'react-rewards';

const { Title } = Typography;

const RewardSpan = () => {
    return (
      <span id="rewardId" style={{ left: "55%", top: "12%", position: "relative", transform: "translate(-50%,-50%)", width: 2, height: 2, background: "red"}} />
    )
  }

export const NFTClaimed = () => {

    const { reward } = useReward('rewardId', 'confetti', { elementCount: 200, spread: 85 });

    useEffect(() => {
        reward();
    }, []);

    return (
        <>
        <Title
            style={{
                width: 400,
                left: "52%", top: "30%",
                position: "relative",
                transform: "translate(-50%,-50%)"

        }}>
            Yay, You go it! <br /> Enjoy your NFT 🥳🎉
            <br />
            Courtesy of <span className="gradient-text">Pied Piper</span>
        </Title>
        <RewardSpan />
    </>
    )
}