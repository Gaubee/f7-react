import subsetFont from "subset-font";
import path from "node:path";
import fs from "node:fs";
const f7iconWoff2 = path.resolve(import.meta.dirname!, "../../assets/Framework7Icons-Regular.woff2");
const subsetBuffer = await subsetFont(
  fs.readFileSync(f7iconWoff2),
  `airplane
chevron_right
chevron_left_ios
chevron_right_ios
arrow_left_md
arrow_right_md
chevron_right_md
chevron_left_md
sort_ios
sort_md
delete_round_ios
delete_round_md
checkbox_ios
checkbox_md
radio_ios
arrow_bottom_md
search_ios
search_md
prev
next
notification_close_ios
delete_round_md`,
  {
    targetFormat: "woff2",
  },
);

fs.writeFileSync(path.resolve(import.meta.dirname!, "../../assets/Framework7Icons-Regular-subset.woff2"), subsetBuffer);
