import subsetFont from "subset-font";
import path from "node:path";
import fs from "node:fs";
const f7iconWoff2 = path.resolve(import.meta.dirname!, "../../assets/Framework7Icons-Regular.woff2");
// import {f7IconNames}from '../../custom/icon/f7-icon.types.ts'
const subsetBuffer = await subsetFont(
  fs.readFileSync(f7iconWoff2),
  Array.from({length:100},(_,index)=>String.fromCharCode(0xe001 + index)).join(""),
  {
    targetFormat: "woff2",
  },
);

fs.writeFileSync(path.resolve(import.meta.dirname!, "../../assets/Framework7Icons-Regular-subset.woff2"), subsetBuffer);
