import { func_remember, obj_omit } from "@gaubee/util";
import type { Router } from "framework7/types";
import { z } from "zod";
import type { PageFC } from "./safe_page.ts";
import { safe_path_params } from "./safe_path.ts";

type zJson = z.ZodObject<
  Record<string, z.ZodString | z.ZodNumber | z.ZodEnum<any> | z.ZodUnion<any> | z.ZodOptional<any>>,
  any,
  any,
  Record<string, string | number | undefined>
>;
type RouteConfig = Omit<Router.RouteParameters, "path"> & {
  path?: string;
  params?: zJson;
  query?: zJson;
};
type RouteControllerNavOptions<T extends RouteConfig = RouteConfig> = CanVoidOptions<
  Omit<Router.RouteOptions, "props" | "query"> & {
    query: ZJsonType<T["query"]>;
    params: ZJsonType<T["params"]>;
    props: RouteConfigPagePropsType<T>;
  }
>;
export type RouteController<T extends RouteConfig = RouteConfig> = {
  zParams: T["params"];
  zQuery: T["query"];
  base: string;
  nav: (options: RouteControllerNavOptions<T>) => void;
} & {
  [key in RouteParametersSymbol]: Router.RouteParameters;
};
type NavOptions<T extends RouteConfig = RouteConfig> = Omit<Router.RouteOptions, "props"> & {
  params: ZJsonType<T["params"]>;
  query: ZJsonType<T["query"]>;
  props: RouteConfigPagePropsType<T>;
};

type CanVoid<T> = { [K in keyof T]: undefined } extends {
  [K in keyof T]: undefined extends T[K] ? undefined : T[K];
}
  ? void | T
  : T;
type AutoPartial<T> = {
  [K in keyof T as null extends T[K] ? K : never]?: T[K];
} & {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
};
// type Original = { a: number | null; b: string };
// type A = AutoPartial<Original>;

// type CanVoidOptions1<T extends NavOptions> = null extends T["params"]
//   ? null extends T["props"]
//     ? Partial<T> | void | null
//     : Omit<T, "params"> & { params?: T["params"] }
//   : null extends T["props"]
//     ? Omit<T, "props"> & { props?: T["props"] }
//     : T;

type CanVoidOptions<T extends NavOptions> = AutoPartial<CanVoid<T>>;

export type RouteParametersSymbol = symbol;
export type GroupRouteParametersSymbol = symbol;
const routeParameters: unique symbol = Symbol("routeParameters");
const groupRouteParameters: unique symbol = Symbol("groupRouteParameters");
const groupBase = Symbol("groupBase");
type ZJsonType<T> = T extends z.ZodType ? z.infer<T> : void | null;
type PagePropsType<T> = T extends PageFC<infer T> ? ({} extends T ? T | void | null : T) : void | null;
type RouteConfigPagePropsType<T> = T extends
  | {
      asyncComponent: () => Promise<{ default: infer P }>;
    }
  | { component: infer P }
  ? PagePropsType<P>
  : void | null;

const to_kebab_case = (key: string) => key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

let f7router: Router.Router | undefined;
export const bindF7Router = (router: Router.Router): void => {
  f7router = router;
};

export class SafeF7Routes<CS extends {} = {}> {
  constructor(readonly cs: CS = {} as CS) {
    Reflect.set(cs, groupRouteParameters, exportF7Routes(cs));
    Reflect.set(cs, groupBase, "");
  }
  addRoute<T extends Record<string, RouteConfig>>(configs: T) {
    const sub = buildCs(configs);
    return new SafeF7Routes({ ...this.cs, ...sub.cs });
  }
  addRoutes<T extends Record<string, SafeF7Routes<any>>>(routesmap: T) {
    type GetCS<T> = T extends SafeF7Routes<infer CS> ? Omit<CS, GroupRouteParametersSymbol> : never;
    const csmap: { [key in keyof T]: GetCS<T[key]> } = {} as any;
    for (const key in routesmap) {
      const routes = routesmap[key];
      if (routes instanceof SafeF7Routes) {
        const self_base = `/${to_kebab_case(key)}`;
        const base_path = Reflect.get(this.cs, groupBase) + self_base;
        (csmap as any)[key] = {
          ...csAddBase(routes.exportControllers(), base_path),
          [routeParameters]: {
            path: self_base,
            routes: routes.exportF7Routes(),
          },
        };
      }
    }
    return new SafeF7Routes({ ...this.cs, ...csmap });
  }
  exportControllers() {
    return this.cs;
  }
  exportNavigater = func_remember((): SafeNavigater<CS> => safeNavigater(this.exportControllers()));
  exportF7Routes() {
    return Reflect.get(this.cs, groupRouteParameters) as Router.RouteParameters[];
  }
}

type SafeNavigater<T> = T extends { nav: (...args: any) => any }
  ? T["nav"]
  : {
      [key in keyof T]: SafeNavigater<T[key]>;
    };
export const safeNavigater = <T extends {}>(obj: T): SafeNavigater<T> => {
  const res = {} as SafeNavigater<T>;
  for (const key in obj) {
    const val = obj[key];
    if (val && typeof val === "object" && "nav" in val && typeof val.nav === "function") {
      //@ts-ignore
      res[key] = (...args: any) => val.nav(...args);
    } else {
      //@ts-ignore
      res[key] = safeNavigater(val);
    }
  }
  return res;
};
const buildCs = <T extends Record<string, RouteConfig>>(configs: T) => {
  const cs: {
    [key in keyof T]: RouteController<T[key]>;
  } = {} as any;
  for (const key in configs) {
    const config = configs[key];
    const params = config.params;
    const query = config.query;
    let path: string;
    if (config.path) {
      path = config.path;
    } else {
      path = `/${to_kebab_case(key)}`;
      if (params && params.shape) {
        const path_params: string[] = [];
        for (const paramKey in params.shape) {
          path_params.push(`/:${paramKey}`);
        }
        path += path_params.join("/") + "/";
      }
    }
    cs[key] = {
      [routeParameters]: {
        ...obj_omit(config, "params"),
        path: path,
      },
      zParams: params,
      zQuery: query,
      base: "",
      nav(opts) {
        //@ts-ignore
        const { params, query, ...options } = opts ?? {};
        const full_path = this.base + this[routeParameters].path;
        const url = params ? safe_path_params(full_path, params) : full_path;
        console.log("navigate to ", url);
        if (query) {
          f7router?.navigate({ path: url, query }, options);
        } else {
          f7router?.navigate(url, options);
        }
      },
    };
  }
  return new SafeF7Routes(cs);
};

const exportF7Routes = (cs: Record<string, RouteController>) => {
  const rs: Router.RouteParameters[] = [];
  for (const key in cs) {
    const controller = cs[key];
    if (controller && routeParameters in controller) {
      rs.push(controller[routeParameters]);
    }
  }
  return rs;
};
const csAddBase = (cs: any, new_base: string) => {
  const old_base: string = cs[groupBase];
  const new_cs = {
    ...obj_omit(cs, groupRouteParameters, groupBase),
  };
  for (const key in new_cs) {
    const child = new_cs[key];
    if (groupBase in child) {
      const new_group_base = child[groupBase].replace(old_base, new_base);
      new_cs[key] = {
        ...csAddBase(child, new_group_base),
        [groupBase]: new_group_base,
      };
    } else {
      new_cs[key] = { ...child, base: new_base };
    }
  }
  new_cs[groupBase] = new_base;
  return new_cs;
};
