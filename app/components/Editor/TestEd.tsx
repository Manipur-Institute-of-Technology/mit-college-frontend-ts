import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import { useEffect, useState } from "react";
import { $generateHtmlFromNodes } from "@lexical/html";
import type { EditorState, LexicalEditor } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const theme = {
  // Theme styling goes here
  //...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

const loadContent = () => {
  return window.localStorage.getItem("ed-content");
};

export default () => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  const [editorState, setEditorState] = useState<EditorState>(() => {
    const cont = loadContent();
    if (cont) return JSON.parse(cont);
    return undefined;
  });

  const onChange = (eds: EditorState) => {
    setEditorState(eds);
  };

  const saveContent = () => {
    const edJSON = editorState.toJSON();
    if (edJSON)
      window.localStorage.setItem("ed-content", JSON.stringify(edJSON));
  };

  useEffect(() => {
    console.log(editorState);
  }, []);

  //   useEffect(() => {
  //     const cont = loadContent();
  //     console.log("cont: ", JSON.stringify(JSON.parse(cont)));
  //     if (cont) setEditorState(JSON.stringify(JSON.parse(cont)));
  //   }, []);

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder={"Enter some text..."}
              placeholder={<div>Enter some text...</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
        <AutoFocusPlugin />
        <TreeViewPlugin />
      </LexicalComposer>
      <pre>{editorState ? JSON.stringify(editorState) : "no state"}</pre>
      <button onClick={saveContent}>Save</button>
      <h2>HTML</h2>
      {"<p>Some Content</p>"}
      {$generateHtmlFromNodes(editorState as any, null)}
    </>
  );
};
