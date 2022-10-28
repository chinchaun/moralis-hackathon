import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { MenuOutlined } from "@ant-design/icons";
import Image from "next/image";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(!visible);
  };

  // If you do not want to auto-close the mobile drawer when a path is selected
  // Delete or comment out the code block below
  // From here
//   let { pathname: location } = useLocation();
//   useEffect(() => {
//     setVisible(false);
//   }, [location]);
  // Upto here

  return (
    <nav className="navbar">
      <Layout>
        <Layout.Header className="nav-header">
        <div className="logo">
            {/* <h1 style={{ fontSize: "25px" }} className="gradient-text">Pied Piper Money</h1> */}
            <div style={{ marginTop: "-34px" }}>
              <Image src="/logo.png" alt="me" width="250" height="170" />
            </div>

          </div>
          {/* <div className="navbar-menu">
            <div className="leftMenu">
              <LeftMenu mode={"horizontal"} />
            </div>
            <Button type="primary"> Connect Wallet </Button>
            <Button className="menuButton" type="text" onClick={showDrawer}>
              <MenuOutlined />
            </Button>
            <div className="rightMenu">
              <RightMenu mode={"horizontal"} />
            </div>
            <Drawer
              title={"Brand Here"}
              placement="right"
              closable={true}
              onClose={showDrawer}
              visible={visible}
              style={{ zIndex: 99999 }}
            >
              <LeftMenu mode={"inline"} />
              <RightMenu mode={"inline"} />
            </Drawer>
          </div> */}
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default Navbar;
