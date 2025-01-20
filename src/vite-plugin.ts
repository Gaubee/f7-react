export default function gaubeeF7ReactVitePlugin() {
  return {
    name: "gaubee-f7-react/css",
    config(config: any) {
      const components =
        `dialog|popup|login-screen|popover|actions|sheet|toast|preloader|progressbar|sortable|swipeout|accordion|contacts-list|virtual-list|list-index|timeline|tabs|panel|card|chip|form|input|checkbox|radio|toggle|range|stepper|smart-select|grid|calendar|picker|infinite-scroll|pull-to-refresh|data-table|fab|searchbar|messages|messagebar|swiper|photo-browser|notification|autocomplete|tooltip|gauge|skeleton|color-picker|treeview|text-editor|pie-chart|area-chart|typography|breadcrumbs`
          .split("|")
          .map((name) => `framework7/components/${name}/css`);

      config.optimizeDeps = {
        ...config.optimizeDeps,
        exclude: [
          "framework7/css",
          ...components,
          ...(config.optimizeDeps.exclude || []),
        ],
      };
    },
  };
}
