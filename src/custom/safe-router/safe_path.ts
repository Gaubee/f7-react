export const safe_path_params = <P extends string>(
  path: P,
  params: Record<ParamKeys<P>, string | number>,
): string =>
  path
    .split("/")
    .map((part) => {
      if (part.startsWith(":")) {
        return params[part.slice(1) as ParamKeys<P>];
      } else {
        return part;
      }
    })
    .join("/");

/**
 * Copyright npm:hono/types
 *
 * import { ParamKeys } from "hono/types";
 */
type ParamKeyName<NameWithPattern> = NameWithPattern extends
  `${infer Name}{${infer Rest}`
  ? Rest extends `${infer _Pattern}?` ? `${Name}?` : Name
  : NameWithPattern;
type ParamKey<Component> = Component extends `:${infer NameWithPattern}`
  ? ParamKeyName<NameWithPattern>
  : never;
export type ParamKeys<Path> = Path extends `${infer Component}/${infer Rest}`
  ? ParamKey<Component> | ParamKeys<Rest>
  : ParamKey<Path>;
export type ParamKeyToRecord<T extends string> = T extends `${infer R}?`
  ? Record<R, string | undefined>
  : {
    [K in T]: string;
  };
