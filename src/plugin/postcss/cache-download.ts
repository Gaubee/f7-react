import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
type CacheInfo = {
  status: [number, string];
  headers: Record<string, string>;
  body: string;
};
export const cacheDownloader: (nsp: string) => typeof fetch = (nsp: string) => {
  const cache_dir = path.join(os.tmpdir(), nsp);
  const fetch2 = async (...args: Parameters<typeof fetch>) => {
    const request = new Request(...args);
    const cache_key = crypto
      .createHash("sha256")
      .update(request.url)
      .update(cacheDownloader.toString())
      .digest("base64url");
    const cache_filename = path.join(cache_dir, cache_key);
    let retry = 3;
    while (true) {
      try {
        const cache_info: CacheInfo = JSON.parse(fs.readFileSync(cache_filename, "utf-8"));
        const response = new Response(Buffer.from(cache_info.body, "base64"), {
          status: cache_info.status[0],
          statusText: cache_info.status[1],
          headers: cache_info.headers,
        });
        Object.defineProperty(response, "url", {
          value: request.url,
          enumerable: true,
          configurable: true,
          writable: false,
        });

        return response;
      } catch (err) {
        const response = await fetch(request);
        if (response.ok) {
          const cache_info: CacheInfo = {
            status: [response.status, response.statusText],
            headers: {},
            body: Buffer.from(await response.arrayBuffer()).toString("base64"),
          };
          response.headers.forEach((value, key) => {
            cache_info.headers[key] = value;
          });

          fs.mkdirSync(cache_dir, { recursive: true });
          fs.writeFileSync(cache_filename, JSON.stringify(cache_info));
        } else {
          retry--;
          if (retry === 0) {
            throw err;
          }
        }
      }
    }
  };
  return fetch2;
};

// const fetch2 = cacheDownloader("demo");
// const res1 = await fetch(
//   "https://fonts.gstatic.com/icon/font?kit=kJF4BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p5Y0J1LlfwZY9nFs9XPaUdIB_ykFPvI8S-dWe-vGjC-swdQk5AMToSyHy06tBsI8FguLtIDdvQZtZrEKUbBnO64UKwrPmVVuT8wPdbRZsHrs-vmE6Szy1mLYJ&skey=b8dc2088854b122f&v=v225",
// );
// const res2 = await fetch2(
//   "https://fonts.gstatic.com/icon/font?kit=kJF4BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p5Y0J1LlfwZY9nFs9XPaUdIB_ykFPvI8S-dWe-vGjC-swdQk5AMToSyHy06tBsI8FguLtIDdvQZtZrEKUbBnO64UKwrPmVVuT8wPdbRZsHrs-vmE6Szy1mLYJ&skey=b8dc2088854b122f&v=v225",
// );
// console.log(Buffer.compare(Buffer.from(await res1.arrayBuffer()), Buffer.from(await res2.arrayBuffer())));
