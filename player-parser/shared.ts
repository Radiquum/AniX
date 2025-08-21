export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Allow, User-Agent",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Cache-Control": "no-cache",
};

export const USERAGENTS = [
  "Mozilla/5.0 (Linux; Android 12.0; LG G8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.2.7124.71 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.5.1269.13 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/123.0 Firefox/123.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.8.4576.73 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/121.0 Firefox/121.0",
  "Mozilla/5.0 (Linux; Android 11.0; OnePlus 10T Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.8.1484.76 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.9.9841.32 Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64; rv:124.0) Gecko/124.0 Firefox/124.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.3457.25 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:124.0) Gecko/124.0 Firefox/124.0",
  "Mozilla/5.0 (Linux; Android 13.0; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.3.1166.27 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.6.4126.27 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/130.0 Firefox/130.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.3.4677.74 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:122.0) Gecko/122.0 Firefox/122.0",
  "Mozilla/5.0 (Linux; Android 12.0; Xiaomi Redmi Note 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.6.3806.92 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.3.9963.85 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/122.0 Firefox/122.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.8.5618.48 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/126.0 Firefox/126.0",
  "Mozilla/5.0 (Linux; Android 12.0; Huawei Mate 40) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6740.69 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.9.2666.21 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/132.0 Firefox/132.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.4804.4 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:128.0) Gecko/128.0 Firefox/128.0",
];

export function asJSON(req, res, object: any, status: number) {
  corsHeaders["Access-Control-Allow-Origin"] = req.headers.origin || "*";

  res.status(status).type("application/json");
  res.set(corsHeaders);
  res.send(JSON.stringify(object));
}

export function randomUA() {
  return USERAGENTS[Math.floor(Math.random() * USERAGENTS.length)];
}
