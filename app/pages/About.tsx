"use server";

import { Card } from "flowbite-react";
import Image from "next/image";

import * as fs from "node:fs";
import * as path from "node:path";
import { CURRENT_APP_VERSION } from "#/api/config";
import Link from "next/link";
import {
  ChangelogAccordion,
  ChangelogMarkdown,
} from "#/components/ChangelogModal/Changelog";
import { compare, splitVersionNumber } from "#/api/utils";

export const AboutPage = () => {
  const directoryPath = path.join(process.cwd(), "public/changelog");
  const changelogFiles = fs.readdirSync(directoryPath);
  const changelogs: Record<string, string> = {};
  const currentVersionName = `${splitVersionNumber(CURRENT_APP_VERSION).major}.${splitVersionNumber(CURRENT_APP_VERSION).minor}.x`;

  changelogFiles.sort(compare);
  changelogFiles.forEach((file) => {
    const changelog = fs.readFileSync(path.join(directoryPath, file), "utf8");
    changelogs[file.replace(".md", "")] = changelog;
  });

  const currentChangelog = changelogs[currentVersionName];
  delete changelogs[currentVersionName];

  return (
    <div className="mb-4">
      <Card>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <div className="flex flex-row items-center gap-4">
              <Image
                src="/images/icons/icon-512x512.png"
                className="flex-shrink-0 w-16 h-16 rounded-full"
                alt="about image"
                width={128}
                height={128}
              />
              <h1 className="text-4xl font-bold">AniX</h1>
            </div>
            <div className="mt-2">
              <p>
                AniX - это неофициальный веб-клиент для Android-приложения
                Anixart. Он позволяет вам получать доступ к своей учетной записи
                Anixart и управлять ею из веб-браузера компьютера или телефона.
                В клиенте доступна синхронизация с аккаунтом и управление его
                списками и избранным. А самое главное - это возможность смотреть
                все доступные аниме из базы Anixart
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="mb-2 text-2xl font-bold">Полезные ссылки</h1>
              <div className="flex flex-row gap-2">
                <Link
                  href={"https://t.me/anix_web"}
                  target="_blank"
                  className="flex items-center gap-3 bg-[#191919] hover:bg-[#303030] text-white transition-colors px-4 py-2 rounded-lg"
                >
                  <span className="w-6 h-6 iconify fa6-brands--telegram text-[#001725] dark:text-[#faf8f9]"></span>
                  <span>Новости</span>
                </Link>
                <Link
                  href={"https://github.com/anix-org"}
                  target="_blank"
                  className="flex items-center gap-3 bg-[#191919] hover:bg-[#303030] text-white transition-colors px-4 py-2 rounded-lg"
                >
                  <span className="w-6 h-6 iconify fa6-brands--github text-[#001725] dark:text-[#faf8f9]"></span>
                  <span>GitHub</span>
                </Link>
                <Link
                  href={"https://wah.su/radiquum"}
                  target="_blank"
                  className="flex items-center gap-3 bg-[#191919] hover:bg-[#303030] text-white transition-colors px-4 py-2 rounded-lg"
                >
                  <span className="w-6 h-6 iconify mdi--person text-[#001725] dark:text-[#faf8f9]"></span>
                  <span>Разработчик</span>
                </Link>
              </div>
            </div>
            <div>
              <div className="flex flex-row gap-2 mb-2">
                <span className="w-8 h-8 iconify tabler--coin text-[#001725] dark:text-[#faf8f9]"></span>
                <h1 className="text-2xl font-bold">Донат</h1>
              </div>
              <div className="flex flex-row gap-2">
                <Link
                  href={"https://dalink.to/radiquum"}
                  target="_blank"
                  className="flex items-center gap-3 bg-[#191919] hover:bg-[#303030] text-white transition-colors px-4 py-2 rounded-lg"
                >
                  <Image
                    src={"/svg/donationAlert.svg"}
                    alt=""
                    width={16}
                    height={16}
                  />
                  <span>dalink</span>
                </Link>
                <Link
                  href={"https://boosty.to/radiquum"}
                  target="_blank"
                  className="flex items-center gap-3 bg-[#191919] hover:bg-[#303030] text-white transition-colors px-4 py-2 rounded-lg"
                >
                  <Image
                    src={"/svg/boosty.svg"}
                    alt=""
                    width={20}
                    height={20}
                  />
                  <span>boosty</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="mt-4">
        <div>
          <h1 className="text-2xl font-bold">Список изменений</h1>
          <p className="text-sm text-gray-500 dark:text-gray-200">
            текущая версия: v{CURRENT_APP_VERSION}
          </p>
        </div>
        <ChangelogMarkdown content={currentChangelog} />
        <ChangelogAccordion contents={changelogs}></ChangelogAccordion>
      </Card>
    </div>
  );
};
