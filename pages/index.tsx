import { EditorState } from "lexical";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useEffect } from "react";
import ToolbarPlugin from "@/components/Toolbar";
import { editorNodes } from "@/utils/editorNodes";

const theme = {
  // Theme styling goes here
  heading: {
    h1: "text-2xl text-green-700",
    h2: "text-xl text-red-700",
    h3: "text-lg text-yellow-600",
  },
  paragraph: "text-base text-indigo-700",
  text: {
    bold: "font-bold text-green-600",
    italic: "font-italic",
    code: "editor-textCode",
    strikethrough: "editor-textStrikethrough",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "editor-textUnderline",
    underlineStrikethrough: "editor-textUnderlineStrikethrough",
  },
};

function MyOnChangePlugin(props: {
  onChange: (editorState: EditorState) => void;
}) {
  const { onChange } = props;
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [onChange, editor]);
  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.log(error);
}

export default function Index() {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [...editorNodes],
  };
  return (
    <>
      <div className="container mx-auto mb-2 px-5 py-20">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="block h-96 w-3/5 rounded-lg border-0 bg-white p-3 text-sm text-gray-800 outline-none focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" />
            }
            placeholder={
              <div className="absolute top-[132px] px-3">
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MyOnChangePlugin
            onChange={(editorState) => {
              console.log(editorState);
            }}
          />
          <HistoryPlugin />
          <ListPlugin />
        </LexicalComposer>
      </div>
    </>
  );
}
