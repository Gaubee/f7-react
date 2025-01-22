import { f7ready } from "f7r";
import { createRoot } from "react-dom/client";

f7ready.then((f7) => {
    Object.assign(globalThis, { f7: f7 });
    console.log("ready");
});

import React from "react";
import App from "./x-app.tsx";
const container = document.getElementById("app")!;
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(React.createElement(App));
