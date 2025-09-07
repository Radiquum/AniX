import { enabledHooks } from "./enabledHooks";

export type Hook = {
  title: string;
  description: string | null;
  priority: number;
  match: (url: URL, method: "GET" | "POST") => boolean;
  hook: (url: URL, data: any, method: "GET" | "POST") => Promise<any>;
};

export const hookList: Hook[] = sortHooks(enabledHooks);

export function sortHooks(hooks: Hook[]) {
  return hooks.sort((a, b) => b.priority - a.priority);
}

export async function runHooks(
  hooks: Hook[],
  url: URL,
  data: any,
  method: "GET" | "POST"
) {
  for (const hook of hooks) {
    if (hook.match(url, method)) {
      data = await hook.hook(data, url, method);
    }
  }
  return data;
}

export default hookList;
