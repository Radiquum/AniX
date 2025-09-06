// import { readdirSync } from "node:fs";



// export function loadHooks() {
//   let hooks: string[] = [];
//   let loadedHooks: Hook[] = [];
//   try {
//     hooks = readdirSync("./src/hooks");
//   } catch (err) {
//     console.error("'hooks' directory not found");
//   }

//   for (const hook of hooks) {
//     try {
//       console.log(hook);
//     //   const _import = await import(`./src/hooks/${hook}`);
//     //   if (_import.default) {
//         // loadedHooks.push(_import.default);
//     //   }
//     } catch (err) {
//       console.error(`Failed to load hook ${hook}`);
//     }
//   }

//   return sortHooks(loadedHooks);
// }

// export function sortHooks(hooks: Hook[]) {
//   return hooks.sort((a, b) => b.priority - a.priority);
// }

// export function runHooks(hooks: Hook[], url: URL, data: any) {
//   for (const hook of hooks) {
//     if (hook.match(url)) {
//       data = hook.hook(url, data);
//     }
//   }
//   return data;
// }
