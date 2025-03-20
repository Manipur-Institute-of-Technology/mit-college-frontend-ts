import type { EditorState } from "lexical";
import { useEffect, useState } from "react";
import EditorApp from "./EditorApp";
import PreviewEditor from "./PreviewEditor";
import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContentsPlugin";

export default () => {
	const [editorState, setEditorState] = useState<string>();
	const [toc, setToc] = useState<
		{
			toc: TableOfContentsEntry;
			scrollIntoView: () => void;
			isActive: () => boolean;
		}[]
	>([]);
	const [curTocIndx, setCurTocIndx] = useState<number>(-1);
	const [previewMode, setPreviewMode] = useState<boolean>(false);

	const editorChangeHandler = (eds: EditorState) => {
		setEditorState(JSON.stringify(eds.toJSON()));
	};

	const saveText = () => {
		if (editorState) window.localStorage.setItem("edState", editorState);
	};

	const loadSaveText = (): string | undefined => {
		return window.localStorage.getItem("edState") || undefined;
	};

	useEffect(() => {
		document.addEventListener("scroll", () => {
			for (const [indx, { isActive }] of toc.entries()) {
				if (isActive()) {
					setCurTocIndx(indx);
					break;
				}
			}
			// console.log(curTocIndx);
		});
		return () => document.removeEventListener("scroll", () => {});
	}, [toc]);

	return (
		<>
			<button
				className="p-2 border rounded-md"
				onClick={() => setPreviewMode((s) => !s)}>
				{previewMode ? "Edit" : "Preview"}
			</button>
			{!previewMode ? (
				<>
					<div>
						<EditorApp
							onChangeHandler={editorChangeHandler}
							initEditorStateLoader={loadSaveText}
						/>
					</div>
					{/* <div>{editorState && editorState.length !== 0 && editorState}</div> */}
					<button onClick={saveText} className="p-2 border rounded-md">
						Save
					</button>
					<button onClick={loadSaveText} className="p-2 border rounded-md">
						Revert Changes
					</button>
				</>
			) : (
				<>
					Index: {curTocIndx}
					<div className="m-auto w-full max-w-100vw bg-gray-50 border border-gray-300 shadow-md p-8">
						<PreviewEditor
							initEditorStateLoader={loadSaveText}
							tableOfContentSetter={(
								list: {
									toc: TableOfContentsEntry;
									scrollIntoView: () => void;
									isActive: () => boolean;
								}[],
							) => setToc(list)}
						/>
					</div>
					{toc.length !== 0 && (
						<div
							className="border"
							style={{
								position: "fixed",
								bottom: 0,
								right: 0,
								background: "rgba(250, 250, 250, 0.5)",
								backdropFilter: "blur(10px)",
							}}>
							<ul>
								{toc.map((d, i) => (
									<li
										key={i}
										style={{
											listStyle: "none",
										}}>
										<span
											onClick={d.scrollIntoView}
											style={{
												borderRadius: "4px",
												backgroundColor: `${i === curTocIndx ? "salmon" : "inherit"}`,
												paddingLeft: `${(+d.toc[2].slice(1) - 1) * 12}px`,
											}}>
											{d.toc[1]} - {d.toc[2]} - viz:{" "}
											{i === curTocIndx ? "Here" : "Not Here"}
										</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</>
	);
};
