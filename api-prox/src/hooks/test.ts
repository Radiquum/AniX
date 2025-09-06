function match(url: URL): boolean {
  return url.pathname == "/profile/1";
}

function hook(data: any, _: URL) {
  const newUname = "Anixartiki";
  if (!data.hasOwnProperty("profile") || !data.profile) return data;
  data["profile"]["login"] = newUname;
  return data;
}

const entrypoint = { priority: 1, match, hook }
export default entrypoint;