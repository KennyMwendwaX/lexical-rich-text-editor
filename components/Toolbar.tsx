import { $getSelection, $isRangeSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { ListNodeTagType } from "@lexical/list/LexicalListNode";
import { HiDocumentText } from "react-icons/hi";
import { ReactNode, useEffect, useRef, useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";

type HeadingTagType = "h1" | "h2" | "h3";

function HeadingToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const HeadingTags = ["h1", "h2", "h3"];
  const onClick = (tag: HeadingTagType): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <>
      {HeadingTags.map((tag) => (
        <button
          className="rounded-lg bg-blue-600 px-3 py-2 text-white"
          onClick={() => onClick(tag as HeadingTagType)}
          key={tag}>
          {tag.toUpperCase()}
        </button>
      ))}
    </>
  );
}

function ListToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const listTags = ["ol", "ul"];
  const onClick = (tag: ListNodeTagType): void => {
    if (tag === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    } else if (tag === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      return;
    }
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  };

  return (
    <>
      {listTags.map((tag) => (
        <button
          className="rounded-lg bg-blue-600 px-3 py-2 text-white"
          onClick={() => onClick(tag as ListNodeTagType)}
          key={tag}>
          {tag.toUpperCase()}
        </button>
      ))}
    </>
  );
}

function HeadingsToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const HeadingTags = ["h1", "h2", "h3"];

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const tag = event.target.value as HeadingTagType;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <select
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      onChange={onChange}>
      {HeadingTags.map((tag) => (
        <option value={tag} key={tag}>
          {tag.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

interface IHeading {
  id: number;
  tag: JSX.Element;
  text: string;
}

const HeadingTags: IHeading[] = [
  { id: 1, tag: <LuHeading1 />, text: "Heading 1" },
  { id: 2, tag: <LuHeading2 />, text: "Heading 2" },
  { id: 3, tag: <LuHeading3 />, text: "Heading 3" },
];

function HeadingProto(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [selectedOption, setSelectedOption] = useState<IHeading>(
    HeadingTags[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (heading: IHeading) => {
    setSelectedOption(heading);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          id="dropdownHoverButton"
          className="text-gray-900 bg-gray-50 hover:bg-gray-200 focus:ring-4 focus:outline-none border border-gray-300 focus:ring-gray-300 font-medium rounded-lg text-lg px-3 py-2.5 text-center inline-flex items-center"
          type="button"
          onClick={() => setIsOpen(!isOpen)}>
          {/* <div className="mr-2"> {selectedOption.tag}</div>
          {selectedOption.text} */}{" "}
          {selectedOption.tag}
          <RxCaretDown className="w-6 h-6 ml-1" />
        </button>
        {isOpen && (
          <div className="absolute top-0 left-0 z-10 mt-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm">
            <ul className="text-sm text-gray-700">
              {HeadingTags.map((heading) => (
                <li key={heading.id}>
                  <button
                    type="button"
                    onClick={() => handleOptionClick(heading)}
                    className={`${
                      selectedOption.id === heading.id ? "bg-gray-100" : ""
                    } inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-100`}>
                    <div className="mr-2 text-lg">{heading.tag}</div>{" "}
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default function ToolbarPlugin(): JSX.Element {
  return (
    <div className="flex items-center space-x-2">
      <HeadingToolbarPlugin />
      <HeadingsToolbarPlugin />
      <ListToolbarPlugin />
      <HeadingProto />
    </div>
  );
}
