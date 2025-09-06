export type Hook = {
  priority: number;
  match: (url: URL, method: "GET" | "POST") => boolean;
  hook: (url: URL, data: any, method: "GET" | "POST") => any;
};

import testHook from "./test.ts";

export const hookList: Hook[] = sortHooks([testHook]);

export function sortHooks(hooks: Hook[]) {
  return hooks.sort((a, b) => b.priority - a.priority);
}

export function runHooks(hooks: Hook[], url: URL, data: any, method: "GET" | "POST") {
  for (const hook of hooks) {
    if (hook.match(url, method)) {
      data = hook.hook(data, url, method);
    }
  }
  return data;
}

export default hookList;
