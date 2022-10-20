import React from "react";
import { Menu } from "antd";

const LeftMenu = ({ mode }: { mode: "horizontal" | "inline" }) => {
  return (
    <Menu mode={mode}>
      <Menu.Item key="explore">Explore</Menu.Item>
      <Menu.Item key="features">Features</Menu.Item>
      <Menu.Item key="about">About Us</Menu.Item>
      <Menu.Item key="contact">Contact Us</Menu.Item>
      <Menu.Item key="contact1">BB</Menu.Item>
    </Menu>
  );
};

export default LeftMenu;
