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
      <h1>Hello World</h1>
      <MsIcon name="ms-sharp-face_right" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="ms-face_right" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="ms-face" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="ms-10k" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
      <MsIcon name="ms-123" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150" />
    </Page>
  );
};
