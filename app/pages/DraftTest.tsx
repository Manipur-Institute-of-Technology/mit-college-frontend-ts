// import React, { useState, Component } from "react";
// import { EditorState, RichUtils, convertToRaw } from "draft-js";
// // import "draft-js/dist/Draft.css";
// import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
// import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// export class EditorConvertToHTML extends Component {
// 	state = {
// 		editorState: EditorState.createEmpty(),
// 	};

// 	onEditorStateChange = (editorState) => {
// 		this.setState({
// 			editorState,
// 		});
// 	};

// 	render() {
// 		const { editorState } = this.state;
// 		return (
// 			<div>
// 				<h2>This is some </h2>
// 				<Editor
// 					editorStyle={{
// 						height: "40vh",
// 					}}
// 					placeholder="Enter your content here"
// 					editorState={editorState}
// 					onEditorStateChange={this.onEditorStateChange}
// 					toolbar={{
// 						image: {
// 							urlEnabled: true,
// 							inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
// 						},
// 					}}
// 				/>
// 				<textarea
// 					disabled
// 					value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
// 				/>
// 			</div>
// 		);
// 	}
// }

// export function EditorComponent() {
// 	return (
// 		<>
// 			<div className="border border-rose-700 px-1">
// 				<Editor />
// 			</div>
// 			<ControlledEditor />
// 		</>
// 	);
// }

// class ControlledEditor extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			editorState: EditorState.createEmpty(),
// 		};
// 	}

// 	onEditorStateChange = (editorState) => {
// 		this.setState({
// 			editorState,
// 		});
// 	};

// 	render() {
// 		const { editorState } = this.state;
// 		return (
// 			<div>
// 				<Editor
// 					editorState={editorState}
// 					wrapperClassName="demo-wrapper"
// 					editorClassName="demo-editor"
// 					onEditorStateChange={this.onEditorStateChange}
// 				/>
// 				<textarea
// 					disabled
// 					value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
// 				/>
// 			</div>
// 		);
// 	}
// }

// // function DraftTest() {
// // 	const [editorState, setEditorState] = useState(() =>
// // 		EditorState.createEmpty(),
// // 	);

// // 	const handleKeyCommand = (command, editorState) => {
// // 		const newState = RichUtils.handleKeyCommand(editorState, command);
// // 		if (newState) {
// // 			this.onChange(newState);
// // 			return "handled";
// // 		}
// // 		return "not-handled";
// // 	};

// // 	return (
// // 		<div className="border">
// // 			<h1>This is draft js</h1>
// // 			<div className="border border-rose-500">
// // 				<Editor
// // 					editorState={editorState}
// // 					onChange={setEditorState}
// // 					handleKeyCommand={handleKeyCommand}
// // 				/>
// // 			</div>
// // 		</div>
// // 	);
// // }
