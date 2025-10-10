interface UserSocialProps {
  icon: string;
  url?: string;
  nickname: string;
  color: string;
}

export const UserSocial = ({ nickname, icon, color }: UserSocialProps) => {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color)] hover:bg-[var(--color)] group transition-colors"
      style={{ "--color": `#${color}` } as React.CSSProperties}
    >
      <span className={`iconify w-6 h-6 bg-[var(--color)] ${color == "ffffff" ? "group-hover:invert" : ""} group-hover:bg-white ${icon} transition-colors`}></span>
      <p className={`${color == "ffffff" ? "group-hover:invert" : ""} group-hover:text-white`}>{nickname}</p>
    </div>
  );
};
