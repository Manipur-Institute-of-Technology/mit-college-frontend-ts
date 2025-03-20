import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContentsPlugin";
import { $getRoot } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import { useEffect } from "react";

/**
 * Plugin that return Table of content list, along with thier scrollIntoView function from the editor
 */

type Props = {
	tableOfContentSetter: (
		list: {
			toc: TableOfContentsEntry;
			scrollIntoView: () => void;
			isActive: () => boolean;
		}[],
	) => void;
};

export default (props: Props) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		// Get all heading node from editor
		const toc: TableOfContentsEntry[] = [];
		// TODO: Since, LoadInitTextPlugin use setTimeout to set the editor state,
		// to read the TOC, we need setTimeout also
		setTimeout(() => {
			editor.getEditorState().read(() => {
				for (const child of $getRoot().getChildren()) {
					if ($isHeadingNode(child)) {
						toc.push([child.getKey(), child.getTextContent(), child.getTag()]);
					}
				}
			});
			props.tableOfContentSetter(
				toc.map((d) => ({
					toc: d,
					scrollIntoView: () => {
						const elm = editor.getElementByKey(d[0]);
						if (elm) elm.scrollIntoView({ behavior: "smooth", block: "start" });
					},
					isActive: () => {
						const elm = editor.getElementByKey(d[0]);
						if (elm) {
							return elm.getBoundingClientRect().bottom > 0;
						}
						return false;
					},
				})),
			);
		});
	}, [editor]);

	return null;
};
