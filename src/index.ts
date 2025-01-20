import * as f7react from "framework7-react";
import type Framework7 from "framework7/lite";

export const f7ready = (() =>
  new Promise<Framework7>((resolve) => {
    f7react.f7ready(() => {
      // Object.assign(globalThis, { f7: f7react.f7 });
      resolve(f7react.f7);
    });
  }))();
