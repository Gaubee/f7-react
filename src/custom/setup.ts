// import "framework7";
import "framework7/css";
import Framework7React from "framework7-react";
import Framework7 from "framework7/lite";

/// 安装插件，等价于执行了 f7initEvents
/// 而 f7init 则需要 App 组件挂载到元素后，开始执行
Framework7.use(Framework7React);
