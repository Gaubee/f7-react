import React from 'react'
import type { ListProps as ContactsListProps } from "../components/list.ts";
import { default as List } from "framework7-react/components/list.js";
export type { ContactsListProps };
export const ContactsList: React.FC<ContactsListProps> = ({ children, ...props }) => {
  return (
    <List {...props} contactsList>
      {children}
    </List>
  );
};
