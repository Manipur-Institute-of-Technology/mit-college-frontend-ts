import { useEffect, useState } from "react";
import PreviewEditor from "~/components/Editor/PreviewEditor";
import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContentsPlugin";
import type { Route } from "./+types/editor";
import { genPageMetaData } from "~/utils/meta";
import { XPreviewEditor } from "./test1";

export function meta({}: Route.MetaArgs) {
  return genPageMetaData({ title: "Editor Test" });
}

export default function Editor() {
  return <XPreviewEditor />;
}
