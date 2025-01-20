import { default as _List, ListProps as _ListProps } from "framework7-react/components/list.js";
export type ListProps = Omit<
  _ListProps,
  | "contactsList"
  | "virtualList"
  | "virtualListParams"
  | "onVirtualItemBeforeInsert"
  | "onVirtualBeforeClear"
  | "onVirtualItemsBeforeInsert"
  | "onVirtualItemsAfterInsert"
>;
export const List = _List as React.FunctionComponent<ListProps>;

// virtualList ?: boolean;
// virtualListParams ?: Object;
// onVirtualItemBeforeInsert ?: (vl?: VirtualList.VirtualList, itemEl?: HTMLElement, item?: any) => void;
// onVirtualBeforeClear ?: (vl?: VirtualList.VirtualList, fragment?: any) => void;
// onVirtualItemsBeforeInsert ?: (vl?: VirtualList.VirtualList, fragment?: any) => void;
// onVirtualItemsAfterInsert ?: (vl?: VirtualList.VirtualList, fragment?: any) => void;
