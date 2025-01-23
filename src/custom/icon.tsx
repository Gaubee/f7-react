import React from "react";
import { MaterialSymbolType, MaterialSymbolName, materialSymbolNameParser } from "./icon.types.ts";
export type * from "./icon.types.ts";
export { default as _Icon } from "framework7-react/components/icon.js";
type MaterialSymbolTypePrefix = "" | `${MaterialSymbolType}-`;

export const MsIcon: React.FC<
  React.HTMLAttributes<HTMLElement> & { name: `msi-${MaterialSymbolTypePrefix}${MaterialSymbolName}` & string }
> = (props) => {
  const msicon = materialSymbolNameParser(props.name);
  if (msicon) {
    return (
      <i {...props} className={`material-symbols-${msicon.type} ${props.className ?? ""}`}>
        {msicon.name}
      </i>
    );
  }
};
