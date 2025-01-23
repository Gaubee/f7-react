import React from "react";
import { Page } from "f7r/page";
import { Navbar } from "f7r/navbar";
// import Face from "@material-symbols/svg-400/outlined/face.svg";
// console.log("Face", Face);
import { MsIcon } from "f7r/icon";

export default () => {
  return (
    <Page>
      <Navbar title="Home" sliding></Navbar>
      <h1 className="text-3xl">Hello World</h1>
      <MsIcon name="msi-rounded-face_right" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="msi-face_right" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="msi-face" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="msi-10k" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="msi-123" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="msi-radio_button_checked" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="msi-radio_button_unchecked" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="msi-password" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
    </Page>
  );
};
