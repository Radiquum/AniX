export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Sign",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Cache-Control": "no-cache",
};

import { Request, Response } from "express";
export function asJSON(req: Request,res: Response, object: any, status: number) {
  corsHeaders["Access-Control-Allow-Origin"] = req.headers.origin || "*";

  res.status(status).type("application/json");
  res.set(corsHeaders);
  res.send(JSON.stringify(object));
}

export const ANIXART_UA =
  "AnixartApp/9.0 BETA 5-25062213 (Android 9; SDK 28; arm64-v8a; samsung SM-G975N; en)";
export const ANIXART_API = "https://api.anixart.app";

export type ANIXART_HEADERST = {
  "User-Agent": string;
  "Content-Type": string;
  "Api-Version"?: string;
};
export const ANIXART_HEADERS: ANIXART_HEADERST = {
  "User-Agent": ANIXART_UA,
  "Content-Type": "application/json; charset=UTF-8",
};

type LogLevel = "debug" | "info" | "warn" | "error" | "disable";
export class Log {
  level: LogLevel;
  levelInt = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    disable: 4,
  };

  constructor(level: LogLevel = "info") {
    this.level = level;
  }

  getString(...args: string[]): string {
    return args.toString();
  }

  getTime(): string {
    const datetime = new Date();
    return `${datetime.getHours().toString().padStart(2, "0")}:${datetime.getMinutes().toString().padStart(2, "0")}:${datetime.getSeconds().toString().padStart(2, "0")}`;
  }

  console(logLevel: LogLevel = "info", ...msg: any[]) {
    if (this.levelInt[this.level] <= this.levelInt[logLevel])
      console.log(`[${logLevel.toUpperCase()}](${this.getTime()}) -> `, ...msg);
  }
  debug(...msg: string[]) {
    if (this.levelInt[this.level] <= 0)
      console.log(`[DEBUG](${this.getTime()}) -> ${this.getString(...msg)}`);
  }
  info(...msg: string[]) {
    if (this.levelInt[this.level] <= 1)
      console.log(`[INFO](${this.getTime()}) -> ${this.getString(...msg)}`);
  }
  warn(...msg: string[]) {
    if (this.levelInt[this.level] <= 2)
      console.log(`[WARN](${this.getTime()}) -> ${this.getString(...msg)}`);
  }
  error(...msg: string[]) {
    if (this.levelInt[this.level] <= 3)
      console.log(`[ERROR](${this.getTime()}) -> ${this.getString(...msg)}`);
  }

  consoleHook(logLevel: LogLevel = "info", ...msg: any[]) {
    if (this.levelInt[this.level] <= this.levelInt[logLevel])
      console.log(
        `[${logLevel.toUpperCase()}|HOOK](${this.getTime()}) -> `,
        ...msg
      );
  }
  debugHook(...msg: string[]) {
    if (this.levelInt[this.level] <= 0)
      console.log(
        `[DEBUG|HOOK](${this.getTime()}) -> ${this.getString(...msg)}`
      );
  }
  infoHook(...msg: string[]) {
    if (this.levelInt[this.level] <= 1)
      console.log(
        `[INFO|HOOK](${this.getTime()}) -> ${this.getString(...msg)}`
      );
  }
  warnHook(...msg: string[]) {
    if (this.levelInt[this.level] <= 2)
      console.log(
        `[WARN|HOOK](${this.getTime()}) -> ${this.getString(...msg)}`
      );
  }
  errorHook(...msg: string[]) {
    if (this.levelInt[this.level] <= 3)
      console.log(
        `[ERROR|HOOK](${this.getTime()}) -> ${this.getString(...msg)}`
      );
  }
}

export const logger = new Log((process.env.LOG_LEVEL as LogLevel) || "info");

export interface GetHook {
  match: (path: string) => boolean;
  get: (data: any, url: URL) => any;
}

export interface PostHook {
  match: (path: string) => boolean;
  post: (body: any, url: URL) => any;
}

export interface LoadedHook {
  path: string;
  mtime: string;
}
