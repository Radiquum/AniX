// хук включает "вечную" спонсорку, отключая рекламу после входа в профиль, в официальном приложении

export function match(path: string): boolean {
  const pathRe = /^\/profile\/\d+/;
  if (pathRe.test(path) || path == "/profile/info") return true;
  return false;
}

export async function get(data: any, url: URL) {
  if (data.hasOwnProperty("profile")) {
    data["profile"]["is_sponsor"] = true;
    data["profile"]["sponsorshipExpires"] = 2147483647;
  } else {
    data["is_sponsor"] = true;
    data["sponsorship_expires"] = 2147483647;
  }
  return data;
}
