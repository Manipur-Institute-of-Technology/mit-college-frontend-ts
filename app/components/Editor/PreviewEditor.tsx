import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContentsPlugin";

import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import PlaygroundNodes from "./nodes/PlaygroundNodes";

import LoadInitTextPlugin from "./plugins/LoadInitTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import PreviewTableOfContentPlugin from "./plugins/PreviewTableOfContentPlugin";
import { buildImportMap } from "./utils/htmlImportMap";

// import "./style.css";
// import "./index.css";

interface PreviewEditorProps {
  initEditorStateLoader: () => string | undefined | Promise<string | undefined>;
  tableOfContentSetter: (
    list: {
      toc: TableOfContentsEntry;
      scrollIntoView: () => void;
      isActive: () => boolean;
    }[],
  ) => void;
}

export default (props: PreviewEditorProps) => {
  const initialConfig: InitialConfigType = {
    html: { import: buildImportMap() },
    namespace: "myEditor",
    theme: PlaygroundEditorTheme,
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
  };
  const placeholder = "Loading Contents...";

  return (
    <>
      <LexicalComposer initialConfig={{ ...initialConfig, editable: false }}>
        <RichTextPlugin
          contentEditable={
            <div
              className="editor-scroller"
              style={{
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              <div className="editor">
                <ContentEditable
                  aria-placeholder={placeholder}
                  placeholder={<PlaceHolderSkeleton />}
                  // placeholder={<span>{placeholder}</span>}
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LoadInitTextPlugin loader={props.initEditorStateLoader} />
        <PreviewTableOfContentPlugin
          tableOfContentSetter={props.tableOfContentSetter}
        />
      </LexicalComposer>
    </>
  );
};

const PlaceHolderSkeleton = () => {
  return (
    // <div className="w-full max-h-[80vh] md:h-full border border-gray-300 rounded-md p-2 overflow-y-hidden">
    <div className="w-full h-full border border-gray-300 rounded-md p-2">
      {Array.from({ length: 2 }, (_, i) => (
        <div
          key={i}
          className="w-full h-[24rem] bg-gray-300 my-1 rounded-md animate-bg"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #d1d5dc 0%, #aaa 50%, #d1d5dc 100%)",
          }}
        />
      ))}
    </div>
  );
};
