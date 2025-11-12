"use client";

import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { tryCatch } from "#/api/utils";
import { ChangelogAccordion, ChangelogMarkdown } from "./Changelog";

export const ChangelogModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  versionResponse: {
    version: string;
    version_changelog: string;
    previous_changelogs: Array<string>;
  };
}) => {
  const [currentVersionChangelog, setCurrentVersionChangelog] = useState("");
  const [previousVersionsChangelog, setPreviousVersionsChangelog] = useState<
    Record<string, string>
  >({});

  async function _fetchVersionChangelog(filename: string) {
    const { data, error } = await tryCatch(fetch(`/changelog/${filename}`));
    if (error) {
      return "Нет списка изменений";
    }
    return await data.text();
  }

  useEffect(() => {
    if (
      props.versionResponse.version_changelog != "" &&
      currentVersionChangelog == ""
    ) {
      setCurrentVersionChangelog("Загрузка ...");
      _fetchVersionChangelog(props.versionResponse.version_changelog).then(
        (data) => {
          setCurrentVersionChangelog(data);
        }
      );
    }
    if (props.versionResponse.previous_changelogs.length > 0) {
      props.versionResponse.previous_changelogs.forEach((version_changelog) => {
        const version = version_changelog.replace(".md", "");
        if (!previousVersionsChangelog.hasOwnProperty(version)) {
          previousVersionsChangelog[version] = "";
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.versionResponse]);

  function accordionCallback(version_changelog: string) {
    if (
      !previousVersionsChangelog.hasOwnProperty(version_changelog) ||
      previousVersionsChangelog[version_changelog] == ""
    ) {
      _fetchVersionChangelog(`${version_changelog}.md`).then((data) => {
        setPreviousVersionsChangelog((prev) => {
          return {
            ...prev,
            [version_changelog]: data,
          };
        });
      });
    }
  }

  return (
    <Modal show={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <ModalHeader>
        Список изменений v{props.versionResponse.version}
      </ModalHeader>
      <ModalBody>
        <ChangelogMarkdown content={currentVersionChangelog} />
        <ChangelogAccordion
          callback={(value) => accordionCallback(value)}
          contents={previousVersionsChangelog}
        />
      </ModalBody>
    </Modal>
  );
};
