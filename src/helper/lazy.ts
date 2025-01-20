// deno-lint-ignore-file no-explicit-any
export const lazyWrap = <T extends React.ComponentType<any>>(
  module: Promise<{ default: T }>,
  ...tasks: (Promise<any> | (() => Promise<any>))[]
) =>
  lazy(() => {
    const ts: [
      Promise<{
        default: T;
      }>,
      ...any,
    ] = [module];
    for (const t of tasks) {
      ts[ts.length] = typeof t === "function" ? t() : t;
    }
    return Promise.all(ts)
      .then(([r]) => r);
  });
import { lazy } from "react";
