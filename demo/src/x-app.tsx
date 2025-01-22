import { App } from "f7r/app";
import { View } from "f7r/view";
import React from "react";
import { f7Routes } from "./routes.ts";
// import routes from '../src/routes.js';

console.log("f7Routes", f7Routes);
export default (): React.JSX.Element => {
  // 禁用 f7 的 browser-history，使用 browser-hash 来自行控制
  const f7BrowserHistory = false;

  return (
    <App
      // theme="md"
      theme="ios"
      name="My App"
      routes={f7Routes}
      popup={{ closeOnEscape: true }}
      sheet={{ closeOnEscape: true }}
      popover={{ closeOnEscape: true }}
      actions={{ closeOnEscape: true }}
    >
      <View
        main
        url="/"
        masterDetailBreakpoint={768}
        browserHistory={f7BrowserHistory}
        browserHistoryInitialMatch={f7BrowserHistory}
        preloadPreviousPage
        iosSwipeBack={false}
        mdSwipeBack={false}
        // transition="f7-push"
        // transition="f7-parallax"
        // transition="f7-cover"
        // transition="slide"
      />
    </App>
  );
};
