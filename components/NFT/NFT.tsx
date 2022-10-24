import { Row, Col, Typography } from "antd"
import { useState } from "react";
import { Footer } from "../Footer";
import { NFTCard } from "./NFTCard";
import { NFTClaimed } from "./NFTClaimed";

export const NFT = () => {
    const [claimed, setClaimed] = useState(false);

    return (
        <Row justify="center" align="top">
            {!claimed &&
                <Col span={24} style={{ height: "75vh" }}>
                    <NFTCard onClaimed={() => setClaimed(true)} />
                </Col>
            }
            {claimed &&
                <Col span={24} style={{ height: "75vh" }}>
                    <NFTClaimed />
                </Col>}
            <Col span={24}>
                <Footer />
            </Col>
        </Row>
    )
}