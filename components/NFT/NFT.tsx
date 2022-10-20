import { Row, Col, Button } from "antd"
import { NFTCard } from "./NFTCard";

export const NFT = () => {
    return (
        <Row justify="center" align="top">
            <Col span={24} style={{ height: "100vh" }}>
                <NFTCard />
            </Col>
        </Row>
    )
}