import { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import ModernParagraph from "../editor/paragraph";
import List from "../editor/list";
import Formula from "../editor/formula";


function Editor({ data, onChange, editorBlock }) {
    const ref = useRef();

    useEffect(() => {
        if (!ref.current) {
            const editor = new EditorJS({
                holder: editorBlock,
                // readOnly: true,
                autofocus: true,
                data,
                async onChange(api, event) {
                    // const data = await api.saver.save()
                    console.log(await api.saver.save())
                },
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true
                    },
                    list: {
                        class: List,
                        inlineToolbar: true
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true
                    },
                    paragraph: {
                        class: ModernParagraph,
                        inlineToolbar: true
                    },
                    formula: {
                        class: Formula,
                        inlineToolbar: true
                    }
                }
            })
            ref.current = editor;
        }
        return () => {
            if (ref.current && ref.current.destroy) {
                ref.current.destroy();
            }
        }
    },  [ data, editorBlock, onChange ]);

    return <div id={editorBlock} />
}

export default memo(Editor);