import { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import EditorjsList from "@editorjs/list";
import Paragraph from "../editor/paragraph"; // твой кастомный параграф
import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";
import Formula from "../editor/formula";

// Рендер всех формул через KaTeX
function renderAllFormulas(container) {
  if (!container) return;

  renderMathInElement(container, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });

  // Сделать формулы редактируемыми по двойному клику
  container.querySelectorAll(".katex").forEach((el) => makeFormulaEditable(el));
}

// Превращает формулу в редактируемое поле по двойному клику
function makeFormulaEditable(el) {
  if (el.dataset.editable) return;

  el.addEventListener("dblclick", () => {
    const latex = el.getAttribute("data-tex");
    const input = document.createElement("input");
    input.value = latex;
    input.style.width = "100%";

    el.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
      const newLatex = input.value;
      const span = document.createElement("span");
      span.setAttribute("data-tex", newLatex);
      span.classList.add("katex-placeholder");

      input.replaceWith(span);

      try {
        katex.render(newLatex, span, { throwOnError: false });
      } catch {
        span.textContent = newLatex;
      }

      // Сделать новый span снова редактируемым
      makeFormulaEditable(span);
    });
  });

  el.dataset.editable = "true";
}

// Проверка: находится ли курсор внутри формулы
function isCursorInsideFormula() {
  const sel = document.getSelection();
  if (!sel || !sel.anchorNode) return false;

  const node = sel.anchorNode;
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    const cursorIndex = sel.anchorOffset;

    const inlineRegex = /\$(.*?)\$/g;
    let match;
    while ((match = inlineRegex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (cursorIndex > start && cursorIndex < end) return true;
    }

    const blockRegex = /\$\$(.*?)\$\$/g;
    while ((match = blockRegex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (cursorIndex > start && cursorIndex < end) return true;
    }
  }
  return false;
}

function Editor({ data, editorBlock }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: editorBlock,
        autofocus: true,
        data,
        onReady: () => {
          renderAllFormulas(containerRef.current);
        },
        tools: {
          table: {
            class: Table,
          },
          header: {
            class: Header,
            inlineToolbar: true,
          },
          list: {
            class: EditorjsList,
            inlineToolbar: true,
          },
          formula: {
            class: Formula,
            inlineToolbar: true
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
        },
      });
      editorRef.current = editor;
    }

    // Следим за курсором: если курсор вне формулы — рендерим все формулы
    const handleSelectionChange = () => {
      if (!isCursorInsideFormula()) {
        renderAllFormulas(containerRef.current);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [data, editorBlock]);

  return <div id={editorBlock} ref={containerRef} />;
}

export default memo(Editor);
