// deno-lint-ignore verbatim-module-syntax
import React from 'react'
import type { ListProps as _ListProps2 } from "../components/list.ts";
import { default as List, type ListProps as _ListProps1 } from "framework7-react/components/list.js";
export type VirtualListProps = _ListProps2 &
  Pick<
    _ListProps1,
    | "virtualListParams"
    | "onVirtualItemBeforeInsert"
    | "onVirtualBeforeClear"
    | "onVirtualItemsBeforeInsert"
    | "onVirtualItemsAfterInsert"
  >;
export const VirtualList: React.FC<VirtualListProps> = ({ children, ...props }) => {
  return (
    <List {...props} virtualList>
      {children}
    </List>
  );
};
