function hideQueryParam(param: string, url: URL) {
  if (url.searchParams.get(param)) {
    url.searchParams.set(param, "***");
  }
}

export const RouteLogger = (message: string) => {
  const args = message.split(" ");
  const direction = args[0];
  const method = args[1];
  const url = new URL("http://example.com" + args[2]);

  hideQueryParam("token", url);
  hideQueryParam("login", url);
  hideQueryParam("password", url);

  if (direction == "<--") {
    console.log(`--> REQ | ${method} ${url.pathname}${url.search}`);
  } else {
    const status = args[3];
    const time = args[4];
    console.log(
      `<-- RES | ${method} ${url.pathname}${url.search} ${status} ${time}`
    );
  }
};

export const InfoLogger = (module: string, ...rest: string[]) => {
  console.log(`--- [${module}] ${rest.join(" ")}`);
};
