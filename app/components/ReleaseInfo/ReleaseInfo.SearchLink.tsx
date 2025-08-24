import Link from "next/link";

// TODO: сделать какую-нибудь анимацию на ссылке при наведении и фокусе
export const ReleaseInfoSearchLink = (props: { title: string, searchBy: string }) => {
  return (
    <Link
      className="text-gray-700 transition-colors duration-300 hover:text-black dark:text-gray-300 hover:dark:text-white"
      href={`/search?query=${props.title}&params={"where"%3A"releases"%2C"searchBy"%3A"${props.searchBy}"}`}
    >
      {props.title}
    </Link>
  );
};
