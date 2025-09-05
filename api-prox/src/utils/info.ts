//     ___          _                 __     ___    ____  ____   ____
//    /   |  ____  (_)  ______ ______/ /_   /   |  / __ \/  _/  / __ \_________  _  ____  __
//   / /| | / __ \/ / |/_/ __ `/ ___/ __/  / /| | / /_/ // /   / /_/ / ___/ __ \| |/_/ / / /
//  / ___ |/ / / / />  </ /_/ / /  / /_   / ___ |/ ____// /   / ____/ /  / /_/ />  </ /_/ /
// /_/  |_/_/ /_/_/_/|_|\__,_/_/   \__/  /_/  |_/_/   /___/  /_/   /_/   \____/_/|_|\__, /
//                                                                                 /____/

export function asciiHTML() {
    const stringBuilder = [];
    stringBuilder.push(`<pre>`);
    stringBuilder.push("    ___          _                 __     ___    ____  ____   ____                       ")
    stringBuilder.push("   /   |  ____  (_)  ______ ______/ /_   /   |  / __ \\/  _/  / __ \\_________  _  ____  __")
    stringBuilder.push("  / /| | / __ \\/ / |/_/ __ `/ ___/ __/  / /| | / /_/ // /   / /_/ / ___/ __ \\| |/_/ / / /")
    stringBuilder.push(" / ___ |/ / / / /&gt;  &lt;/ /_/ / /  / /_   / ___ |/ ____// /   / ____/ /  / /_/ /&gt;  &lt;/ /_/ /")
    stringBuilder.push("/_/  |_/_/ /_/_/_/|_|\\__,_/_/   \\__/  /_/  |_/_/   /___/  /_/   /_/   \\____/_/|_|\\__, /")
    stringBuilder.push("                                                                                /____/")
    stringBuilder.push(`</pre>`);
    return stringBuilder.join("\n");
}

export function separatorHTML() {
    const stringBuilder = [];
    stringBuilder.push(`<pre>`);
    stringBuilder.push("-".repeat(92))
    stringBuilder.push(`</pre>`);
    return stringBuilder.join("\n");
}