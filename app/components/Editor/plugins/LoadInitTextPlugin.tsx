import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function LoadInitTextPlugin({
  loader,
}: {
  loader: () => string | undefined | Promise<string | undefined>;
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const setEds = (txt: undefined | string) => {
      if (txt && txt.length !== 0) {
        const eds = editor.parseEditorState(JSON.parse(txt));
        // TODO: I've no idea why using setTimeout, supressed the
        // react flush error (err mssg: a state update is happenning, while react is rendering)
        // This is a quick hack, need to work on this, later!
        setTimeout(() => {
          editor.setEditorState(eds);
        });
      }
    };

    const txt = loader();
    if (txt instanceof Promise) {
      const loadAsync = async () => {
        const awaitedTxt = await txt;
        setEds(awaitedTxt);
      };
      loadAsync();
    } else {
      setEds(txt);
    }
  }, [editor]);
  return null;
}

// export default function LoadInitTextPlugin({
// 	loader,
// }: {
// 	loader: () => string | undefined | Promise<string | undefined>;
// }) {
// 	const [editor] = useLexicalComposerContext();
// 	useEffect(() => {
// 		const loadContent = async () => {
// 			const txt = await Promise.resolve(loader());
// 			if (txt && txt.length !== 0) {
// 				const eds = editor.parseEditorState(JSON.parse(txt));
// 				// TODO: I've no idea why using setTimeout, supressed the
// 				// react flush error (err mssg: a state update is happenning, while react is rendering)
// 				// This is a quick hack, need to work on this, later!
// 				setTimeout(() => {
// 					editor.setEditorState(eds);
// 				});
// 			}
// 		};
// 		loadContent();
// 	}, [editor, loader]);
// 	return null;
// }
