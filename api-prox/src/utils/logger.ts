export const RouteLogger = (message: string) => {
  const args = message.split(" ");
  const direction = args[0];
  const method = args[1];
  const url = new URL("http://example.com" + args[2]);
  if (url.searchParams.get("token")) {
    url.searchParams.set("token", "*********");
  }

  if (direction == "<--") {
    console.log(`REQ | ${method} ${url.pathname}${url.search}`);
  } else {
    const status = args[3];
    const time = args[4];
    console.log(
      `RES | ${method} ${url.pathname}${url.search} ${status} ${time}`
    );
  }
};
