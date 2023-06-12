import {
  $getSelection,
  $isRangeSelection,
  DEPRECATED_$isGridSelection,
  $createParagraphNode,
} from "lexical";
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
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { BsTextParagraph } from "react-icons/bs";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

type HeadingTagType = "h1" | "h2" | "h3";

interface IHeading {
  id: number;
  tag: HeadingTagType;
  icon: JSX.Element;
  text: string;
}

const HeadingTags: IHeading[] = [
  { id: 1, tag: "h1", icon: <LuHeading1 />, text: "Heading 1" },
  { id: 2, tag: "h2", icon: <LuHeading2 />, text: "Heading 2" },
  { id: 3, tag: "h3", icon: <LuHeading3 />, text: "Heading 3" },
];

function HeadingToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [selectedOption, setSelectedOption] = useState<IHeading>(
    HeadingTags[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (heading: IHeading) => {
    setSelectedOption(heading);
    setIsOpen(false);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(heading.tag));
      }
    });
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
          {selectedOption.icon}
          <RxCaretDown className="w-6 h-6 ml-1" />
        </button>
        {isOpen && (
          <div className="absolute top-2 left-0 z-10 mt-10 bg-gray-50 divide-y divide-gray-100 rounded-lg shadow-sm">
            <ul className="text-sm text-gray-700">
              {HeadingTags.map((heading) => (
                <li key={heading.id}>
                  <button
                    type="button"
                    onClick={() => handleOptionClick(heading)}
                    className={`${
                      selectedOption.id === heading.id ? "bg-gray-200" : ""
                    } inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200`}>
                    <div className="mr-2 text-lg">{heading.icon}</div>{" "}
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

type ListTagType = "ul" | "ol";

type IParagraphTag = {
  id: number;
  icon: JSX.Element;
  name: string;
};

type IHeadingTag = {
  id: number;
  tag: HeadingTagType;
  icon: JSX.Element;
  name: string;
};

type IListTag = {
  id: number;
  tag: ListTagType;
  icon: JSX.Element;
  name: string;
};

type ITag = IParagraphTag | IHeadingTag | IListTag;

const PTag: IParagraphTag[] = [
  { id: 1, icon: <BsTextParagraph />, name: "Normal" },
];

const HTags: ITag[] = [
  { id: 1, tag: "h1", icon: <LuHeading1 />, name: "Heading 1" },
  { id: 2, tag: "h2", icon: <LuHeading2 />, name: "Heading 2" },
  { id: 3, tag: "h3", icon: <LuHeading3 />, name: "Heading 3" },
];

const ListTags: ITag[] = [
  { id: 1, tag: "ul", icon: <AiOutlineUnorderedList />, name: "Bullet List" },
  { id: 2, tag: "ol", icon: <AiOutlineOrderedList />, name: "Numbered List" },
];

const Tags: ITag[] = [...PTag, ...HTags, ...ListTags];

function HeadingProto({
  blockType,
}: {
  blockType: keyof typeof blockTypeToBlockName;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [selectedOption, setSelectedOption] = useState<ITag>(Tags[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (tag: ITag) => {
    setSelectedOption(tag);
    setIsOpen(false);
    // editor.update(() => {
    //   const selection = $getSelection();
    //   if (selection !== null && $isRangeSelection(selection)) {
    //     if (tag.tag === "h1" || tag.tag === "h2" || tag.tag === "h3") {
    //       $setBlocksType(selection, () => $createHeadingNode(tag.tag));
    //       return;
    //     } else if (tag.tag === "ol") {
    //       editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    //       return;
    //     } else if (tag.tag === "ul") {
    //       editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    //       return;
    //     }
    //   }
    // });
  };
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setIsOpen(false);
  };
  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
    setIsOpen(false);
  };

  const formatCheckList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setIsOpen(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
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
          {selectedOption.icon}
          <RxCaretDown className="w-6 h-6 ml-1" />
        </button>
        {isOpen && (
          <div className="absolute top-2 left-0 z-10 mt-10 bg-gray-50 divide-y divide-gray-100 rounded-lg shadow-sm">
            <ul className="py-1 text-sm text-gray-700">
              <li>
                <button
                  type="button"
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <BsTextParagraph className="w-5 h-5 mr-1" /> Normal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <LuHeading1 className="w-5 h-5 mr-1" /> Heading 1
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <LuHeading2 className="w-5 h-5 mr-1" /> Heading 2
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <LuHeading3 className="w-5 h-5 mr-1" /> Heading 3
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <AiOutlineUnorderedList className="w-5 h-5 mr-1" /> Bulleted
                  List
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex w-36 pl-2 items-center py-2 text-sm text-gray-700 hover:bg-gray-200">
                  <AiOutlineOrderedList className="w-5 h-5 mr-1" /> Numbered
                  List
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default function ToolbarPlugin(): JSX.Element {
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");

  return (
    <div className="flex items-center space-x-2">
      <HeadingToolbarPlugin />
      <ListToolbarPlugin />
      <HeadingProto blockType={blockType} />
    </div>
  );
}
