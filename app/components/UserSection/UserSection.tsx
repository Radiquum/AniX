import { Avatar, Card } from "flowbite-react";
import Link from "next/link";

export const UserSection = (props: { sectionTitle?: string; content: any }) => {
  return (
    <section>
      {props.sectionTitle && (
        <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
          <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
            {props.sectionTitle}
          </h1>
        </div>
      )}
      <div className="m-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {props.content.map((user) => {
            return (
              <Link href={`/profile/${user.id}`} key={user.id}>
                <Card>
                  <div className="flex items-center gap-4">
                    <Avatar img={user.avatar} alt="" size="lg" rounded={true} />
                    <p className="text-xl font-medium text-gray-900 dark:text-white">{user.login}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
