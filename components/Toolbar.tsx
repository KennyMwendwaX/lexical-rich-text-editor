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

function HeadingProto(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const HeadingTags = ["H1", "H2", "H3"];
  return (
    <>
      <div>
        <select
          id="style"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="P" selected>
            P
          </option>
          {HeadingTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
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
      <HiDocumentText />
    </div>
  );
}
