# @gaubee/f7-react

对 [Framework7 React](https://framework7.io/react/) 的再次封装。目的有以下几点：

1. 开箱即用的 LazyModule，减少繁琐的配置成本
1. 改进一些组件的封装，使得更加易用
   1. 暴露出 react/swiper 的组件
   1. 从 List 中剥离出 VirtualList/ContactsList 两个组件
   1. 修复 skeleton 的类型问题
1. 路由安全
   1. 提供了一个构建器来自动生成 route-path
   1. 这个构建器是类型安全的，配合自己的项目需求，简单封装，即可实现类型安全的 props、params、query 导航函数
      > PS：你需要先调用 bindF7Router 来提供 f7.router 对象
1. 按需下载的 MaterialSymbols 的图标
   1. 原理是利用tailwind的className裁剪机制，在生成css之后，解析css内容。
      1. 根据ms的规范，有三种字体可以选择：outlinted(默认)/rounded/sharp
      1. 也就是说，你可以通过这样的字符串片段，使得图标被下载： .md-face ===
         .md-outlinted-face、.md-rounded-face、.md-sharp-face
      1. 如果你有动态拼接的需求，你可以在你的代码注释中，书写这些className片段，使得能被tailwindcss识别，并生成对应的className。
   1. 然后再通过google的font-api裁剪接口，下载所需的css和图标文件。
   1. css混入tailwind的内容中，图标文件下载到指定文件夹（也可以内联）
   1. 这就意味着，项目中不出意外的话，不会出现额外的图标，只会按需加载
