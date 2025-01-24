import React from "react";
import { default as _Icon, IconProps } from "framework7-react/components/icon.js";
import { F7IconName, f7IconNameParser } from "./f7-icon.types.ts";
export type * from "./f7-icon.types.ts";

type F7Icon = `f7-${F7IconName}`;
export type F7IconProps = Omit<IconProps, "material" | "f7"> & {
  name?: F7Icon;
  ios?: F7Icon;
  md?: F7Icon;
};
export const F7Icon: React.FC<F7IconProps> = ({ name, ios, md, ...props }) => {
  const f7icon = f7IconNameParser(name);
  const iosicon = f7IconNameParser(ios);
  const mdicon = f7IconNameParser(md);
  if (f7icon || iosicon || mdicon) {
    return (
      <_Icon
        {...props}
        f7={f7icon?.name}
        ios={iosicon?.name ? `f7:${iosicon.name}` : ""}
        md={mdicon?.name ? `f7:${mdicon.name}` : ""}
      ></_Icon>
    );
  }
};
