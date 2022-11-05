import { Row, Col } from "antd"
import { useState } from "react";
import { Footer } from "../Footer";
import { NFTCard } from "./NFTCard";
import { NFTClaimed } from "./NFTClaimed";

export const NFT = () => {
    const [claimed, setClaimed] = useState(false);

    return (
        <div
            style={{
                height: "75vh",
                width: 373,
                left: "50%", top: "50%", position: "relative", transform: "translate(-50%,-50%)"
            }}>
            <Row justify="center" align="top">
                {!claimed &&
                    <Col span={24} style={{ marginBottom: "20px"}}>
                        <NFTCard onClaimed={() => setClaimed(true)} />
                    </Col>
                }
                {claimed &&
                    <Col span={24}>
                        <NFTClaimed />
                    </Col>}
                <Col span={24}>
                    <Footer />
                </Col>
            </Row>
        </div>
    )
}