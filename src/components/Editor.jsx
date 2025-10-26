import { memo, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Table from "@editorjs/table";
import Quote from "@editorjs/quote";
import EditorjsList from "@editorjs/list";
import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";
import Formula from "../editor/formula";
import "../editor.css";

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
        readOnly: true,
        holder: editorBlock,
        autofocus: true,
        data,
        onReady: () => {
          renderAllFormulas(containerRef.current);

          // Удаляем уже существующие caption в quote-блоках
          const removeQuoteCaptions = () => {
        if (!containerRef.current) return;
        containerRef.current
          .querySelectorAll(".cdx-quote__caption")
          .forEach((el) => el.remove());
          };

          removeQuoteCaptions();
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
          }
        },
      });

      // Наблюдатель, который удаляет появляющиеся caption в quote-блоках
      if (containerRef.current) {
        const captionObserver = new MutationObserver((mutations) => {
          for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = /** @type {Element} */ (node);
          if (el.matches && el.matches(".cdx-quote__caption")) {
            el.remove();
          }
          el.querySelectorAll &&
            el.querySelectorAll(".cdx-quote__caption").forEach((n) => n.remove());
        }
          }
        });
        captionObserver.observe(containerRef.current, { childList: true, subtree: true });

        // Оборачиваем destroy, чтобы корректно отсоединять observer при уничтожении редактора
        const originalDestroy = editor.destroy && editor.destroy.bind(editor);
        editor.destroy = async function () {
          try {
        captionObserver.disconnect();
          } catch {}
          if (originalDestroy) {
        await originalDestroy();
          }
        };
      }
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
