import { SafeF7Routes } from "f7r/router";
export const appRoutes = new SafeF7Routes().addRoute({
    home: {
        path: "/",
        asyncComponent: () => import("./page/home.page.tsx"),
    },
    nofound: {
        path: "/404",
        asyncComponent: (): Promise<typeof import("./page/404.tsx")> =>
            import("./page/404.tsx"),
    },
    any: {
        path: "(.*)",
        redirect: "/404",
    },
});

export const f7Routes = appRoutes.exportF7Routes();
