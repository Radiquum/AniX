"use client";

import { SHARE_PREFIX } from "#/api/config";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

type ShareButtonProps = {
  text: string;
};

export const ShareButton = ({ text }: ShareButtonProps) => {
  const pathname = usePathname();

  function copyShareLink() {
    const url = `${SHARE_PREFIX}${pathname}`;
    if (navigator.share) {
      navigator
        .share({ text, url })
        .then(() => toast.success("Ссылка скопирована"))
        .catch((error) => toast.error("Действие отменено"));
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${text} ${url}`)
        .then(() => {
          toast.success("Ссылка скопирована");
        })
        .catch((error) => toast.error("Не удалось скопировать ссылку"));
    } else {
      toast.error("Действие не поддерживается вашим браузером");
    }
  }

  return (
    <button
      className="flex items-center justify-center px-4 py-2 transition-colors first:rounded-l-full last:rounded-r-full hover:bg-gray-300 hover:dark:bg-slate-500"
      onClick={copyShareLink}
    >
      <span className="w-6 h-6 sm:w-8 sm:h-8 iconify mdi--share-variant-outline"></span>
    </button>
  );
};
