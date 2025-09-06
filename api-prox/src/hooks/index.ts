export type Hook = {
  priority: number;
  match: (url: URL) => boolean;
  hook: (url: URL, data: any) => any;
};

import testHook from "./test.ts";

export const hookList: Hook[] = sortHooks([testHook]);

export function sortHooks(hooks: Hook[]) {
  return hooks.sort((a, b) => b.priority - a.priority);
}

export function runHooks(hooks: Hook[], url: URL, data: any) {
  for (const hook of hooks) {
    if (hook.match(url)) {
      data = hook.hook(data, url);
    }
  }
  return data;
}

export default hookList;
