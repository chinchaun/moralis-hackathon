import { Typography } from "antd"
import { MoralisIcon, PolygonIcon } from "./Icons/CustomIcons";
const { Title } = Typography;

export const Footer = () => {
    return (
        <div style={{ left: "50%", top: "20%", position: "relative", transform: "translate(-50%,-50%)", width: "290px" }}>
            <Title level={5}>
                <> <MoralisIcon /> </>
            </Title>
            <div style={{
                marginLeft: "35px",
                marginTop: "-32px"
            }}>
                <Title level={5}>
                    <> Built on <PolygonIcon /> </>
                </Title>
            </div>
        </div>
    )
}