// хук включает "вечную" спонсорку, отключая рекламу после входа в профиль, в официальном приложении

export function match(path: string): boolean {
  if (path == "/profile/info") return true;
  return false;
}

export async function get(data: any, url: URL) {
  data["is_sponsor"] = true;
  data["sponsorship_expires"] = 2147483647;
  return data;
}
