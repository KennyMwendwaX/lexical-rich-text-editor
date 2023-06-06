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

export default function ToolbarPlugin(): JSX.Element {
  return (
    <div className="flex items-center space-x-2">
      <HeadingToolbarPlugin />
      <ListToolbarPlugin />
    </div>
  );
}
