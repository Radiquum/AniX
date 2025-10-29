"use client";

import { SHARE_PREFIX } from "#/api/config";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type ShareButtonProps = {
  text: string;
};

export const ShareButton = ({ text }: ShareButtonProps) => {
  const [FooterH, setFooterH] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window) {
      setFooterH(document.querySelector("footer").clientHeight + 80);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      className="fixed z-50 right-4 lg:bottom-4 bottom-[var(--footer-height)] flex items-center justify-center p-4 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 rounded-full transition-colors"
      onClick={copyShareLink}
      style={{ "--footer-height": `${FooterH}px` } as React.CSSProperties}
    >
      <span className="w-6 h-6 sm:w-8 sm:h-8 iconify mdi--share-variant-outline"></span>
    </button>
  );
};
