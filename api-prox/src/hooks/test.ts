const priority = 0;

function match(url: URL, method: "GET" | "POST"): boolean {
  return url.pathname == "/profile/1" && method == "GET";
}

function hook(data: any, _: URL, __: "GET" | "POST") {
  const newUname = "Anixartiki";
  if (!data.hasOwnProperty("profile") || !data.profile) return data;
  data["profile"]["login"] = newUname;
  return data;
}

const entrypoint = { priority, match, hook };
export default entrypoint;
