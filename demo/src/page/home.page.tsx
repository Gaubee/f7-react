import React from "react";
import { Page } from "f7r/page";
import { Navbar } from "f7r/navbar";
// import Face from "@material-symbols/svg-400/outlined/face.svg";
// console.log("Face", Face);
import { MsIcon, F7Icon } from "f7r/icon";

export default () => {
  return (
    <Page>
      <Navbar title="Home" sliding></Navbar>
      <h1 className="text-3xl">Hello World</h1>
      <MsIcon name="msi-rounded-face_right" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-face_right" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-face" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-10k" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-123" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-function" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-radio_button_checked" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-radio_button_unchecked" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />
      <MsIcon name="msi-password" className="text-6xl msv-wght-100 hover:msv-wght-700 duration-150 outline-1" />

      <F7Icon name="f7-airplane" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-chevron_right" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-chevron_left_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-chevron_right_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-arrow_left_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-arrow_right_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-chevron_right_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-chevron_left_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-sort_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-sort_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-delete_round_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-delete_round_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-checkbox_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-checkbox_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-radio_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-arrow_bottom_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-search_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-search_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-prev" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-next" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-notification_close_ios" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
      <F7Icon name="f7-delete_round_md" className="text-6xl font-thin hover:font-bold duration-150 outline-1"></F7Icon>
    </Page>
  );
};
