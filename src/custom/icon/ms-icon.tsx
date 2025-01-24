import React from "react";
import { MaterialSymbolType, MaterialSymbolName, materialSymbolNameParser } from "./ms-icon.types.ts";
export type * from "./ms-icon.types.ts";
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
