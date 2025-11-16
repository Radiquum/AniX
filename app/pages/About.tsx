"use server";

import { Card } from "flowbite-react";
import Image from "next/image";

import * as fs from "node:fs";
import * as path from "node:path";
import { CURRENT_APP_VERSION } from "#/api/config";
import Link from "next/link";
import { ChangelogAccordion, ChangelogMarkdown } from "#/components/ChangelogModal/Changelog";
import { compare, splitVersionNumber } from "#/api/utils";

export const AboutPage = () => {
  const directoryPath = path.join(process.cwd(), "public/changelog");
  const changelogFiles = fs.readdirSync(directoryPath);
  const changelogs: Record<string, string> = {};
  const currentVersionName = `${splitVersionNumber(CURRENT_APP_VERSION).major}.${splitVersionNumber(CURRENT_APP_VERSION).minor}.x`

  changelogFiles.sort(compare);
  changelogFiles.forEach((file) => {
    const changelog = fs.readFileSync(path.join(directoryPath, file), "utf8");
    changelogs[file.replace(".md", "")] = changelog;
  })

  const currentChangelog = changelogs[currentVersionName];
  delete changelogs[currentVersionName];

  return (
    <div className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Image
            src="/images/icons/icon-512x512.png"
            className="flex-shrink-0 w-32 h-32 rounded-full"
            alt="about image"
            width={128}
            height={128}
          />
          <div>
            <h1 className="text-xl font-bold">
              AniX - Неофициальный веб клиент для Anixart
            </h1>
            <p className="max-w-[900px]">
              AniX - это неофициальный веб-клиент для Android-приложения
              Anixart. Он позволяет вам получать доступ к своей учетной записи
              Anixart и управлять ею из веб-браузера компьютера или телефона. В
              клиенте доступна синхронизация с аккаунтом и управление его
              списками и избранным. А самое главное - это возможность смотреть
              все доступные аниме из базы Anixart даже недоступные на территории
              РФ.
            </p>
          </div>
        </div>
      </Card>
      <Link href={"https://t.me/anix_web"} target="_blank">
        <Card>
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 iconify fa6-brands--telegram text-[#001725] dark:text-[#faf8f9]"></span>
            <div>
              <h1 className="text-xl font-bold">Телеграм канал</h1>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                @anix_web
              </p>
            </div>
          </div>
        </Card>
      </Link>
      <Link href={"https://github.com/Radiquum/AniX"} target="_blank">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 w-16 h-16 iconify fa6-brands--github text-[#001725] dark:text-[#faf8f9]"></span>
            <div>
              <h1 className="text-xl font-bold">Код на GitHub</h1>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                github.com/Radiquum/AniX
              </p>
            </div>
          </div>
        </Card>
      </Link>
      <Card className="md:col-span-2">
        <div>
          <h1 className="text-2xl font-bold">Список изменений</h1>
          <p className="text-sm text-gray-500 dark:text-gray-200">
            текущая версия: v{CURRENT_APP_VERSION}
          </p>
        </div>
        <ChangelogMarkdown content={currentChangelog} />
        <ChangelogAccordion contents={changelogs} ></ChangelogAccordion>
      </Card>
    </div>
  );
};
