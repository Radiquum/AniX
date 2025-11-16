import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const FloatingToolbar = ({ children }: Props) => {
  return (
    <div
      className="fixed z-50 right-4 lg:bottom-4 bottom-[var(--footer-height)] flex items-center justify-center bg-gray-200 dark:bg-slate-700 rounded-full border-2 !border-opacity-5 border-black dark:border-white "
      style={{ "--footer-height": `86px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
