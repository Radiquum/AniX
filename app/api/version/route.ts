import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";
import { CURRENT_APP_VERSION } from "../config";

export function compare(a: string, b: string) {
  const aElement = a.replace(".x.md", "").split(".");
  const bElement = b.replace(".x.md", "").split(".");

  if (Number(bElement[0] || 0) != Number(aElement[0] || 0)) {
    return Number(bElement[0] || 0) - Number(aElement[0] || 0);
  } else if (Number(bElement[1] || 0) != Number(aElement[1] || 0)) {
    return Number(bElement[1] || 0) - Number(aElement[1] || 0);
  } else {
    return 0;
  }
}

export function splitVersionNumber(version: string) {
  const versionArray = version.split(".");
  return {
    major: Number(versionArray[0] || 0),
    minor: Number(versionArray[1] || 0),
    patch: Number(versionArray[2] || 0),
  };
}

export async function GET() {
  const directoryPath = path.join(process.cwd(), "public/changelog");
  const changelogs = fs.readdirSync(directoryPath);

  changelogs.sort(compare);
  changelogs.shift();

  return NextResponse.json({
    version: CURRENT_APP_VERSION,
    version_changelog: `${splitVersionNumber(CURRENT_APP_VERSION).major}.${splitVersionNumber(CURRENT_APP_VERSION).minor}.x.md`,
    previous_changelogs: changelogs,
  });
}
