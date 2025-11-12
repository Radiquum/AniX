import Markdown from "markdown-to-jsx";
import Styles from "./ChangelogModal.module.css";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

export const ChangelogMarkdown = ({content}: { content: string }) => {
  return <Markdown className={Styles.markdown}>{content}</Markdown>;
};

export const ChangelogAccordion = ({callback, contents}: { callback?: any; contents: Record<string, string>}) => {
  return <Accordion collapseAll={true} className="mt-4">
    {Object.keys(contents).map((key) => {
      return <AccordionPanel key={`changelog-accordion-${key}`}>
        <AccordionTitle onClickCapture={callback ? () => callback(key) : null} key={`changelog-accordion-title-${key}`}>{key}</AccordionTitle>
        <AccordionContent>
          <ChangelogMarkdown content={contents[key] != "" ? contents[key] : "Загрузка ..."} />
        </AccordionContent>
      </AccordionPanel>;
    })}
  </Accordion>;
};
