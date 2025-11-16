import { NextResponse } from "next/server";
import * as fs from "node:fs";
import * as path from "node:path";
import { CURRENT_APP_VERSION } from "../config";
import { compare, splitVersionNumber } from "../utils";

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
