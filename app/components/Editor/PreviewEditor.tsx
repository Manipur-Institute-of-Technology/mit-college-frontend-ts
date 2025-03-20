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

interface PreviewEditorProps {
	initEditorStateLoader: () => string | undefined;
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
						<div>
							<ContentEditable
								aria-placeholder={placeholder}
								placeholder={<span>{placeholder}</span>}
							/>
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
