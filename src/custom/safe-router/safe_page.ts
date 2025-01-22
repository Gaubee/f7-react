import type { PageProps } from "framework7-react/components/page.js";
import type { Router } from "framework7/types";
import React from "react";
export type PageParams = {
  f7route: Router.Route;
  f7router: Router.Router;
  pageProps?: PageProps;
  routeState?: RouteState;
};
export { PageProps };
export type RouteState = Record<string, unknown> & {
  readonly [key in typeof route_state_url]: string;
};
export const route_state_url: unique symbol = Symbol.for("url");

export type PageFC<P = {}> = (params: PageParams & P) => React.JSX.Element;
