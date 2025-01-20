import type React from "react";
// deno-lint-ignore no-explicit-any
type PickPartial<T, K extends keyof any> =
  & Omit<T, K>
  & Partial<Pick<T, K & keyof T>>;
type FCProps<FC extends React.FC> = FC extends React.FC<infer P> ? P : never;
// deno-lint-ignore no-explicit-any
type FCPropsPickPartial<FC extends React.FC<any>, K extends keyof FCProps<FC>> =
  FC extends React.FC<infer P> ? React.FC<PickPartial<P, K>>
    : never;

import _SkeletonAvatar from "framework7-react/components/skeleton-avatar.js";
export const SkeletonAvatar = _SkeletonAvatar as FCPropsPickPartial<
  typeof _SkeletonAvatar,
  | "tag"
  | "size"
  | "color"
  | "showIcon"
  | "borderRadius"
>;

import _SkeletonBlock from "framework7-react/components/skeleton-block.js";
export const SkeletonBlock = _SkeletonBlock as FCPropsPickPartial<
  typeof _SkeletonBlock,
  | "tag"
  | "width"
  | "height"
  | "borderRadius"
>;

import _SkeletonImage from "framework7-react/components/skeleton-image.js";
export const SkeletonImage = _SkeletonImage as FCPropsPickPartial<
  typeof _SkeletonImage,
  | "tag"
  | "width"
  | "height"
  | "color"
  | "showIcon"
  | "borderRadius"
>;

import _SkeletonText from "framework7-react/components/skeleton-text.js";
export const SkeletonText = _SkeletonText as FCPropsPickPartial<
  typeof _SkeletonText,
  "tag"
>;
