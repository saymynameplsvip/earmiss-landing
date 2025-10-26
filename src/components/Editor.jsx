import { memo, useEffect, useState, useRef } from "react";
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

const LOADING_PHRASES = [ "Колдуем дизайн 🧙‍♀️", "Расшифровываем аудио 🎃", "Варим конспект 🍄", "Привораживаем пользователей 🔮" ];

function renderAllFormulas(container) {
  if (!container) return;
  renderMathInElement(container, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
  container.querySelectorAll(".katex").forEach((el) => makeFormulaEditable(el));
}

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
      makeFormulaEditable(span);
    });
  });
  el.dataset.editable = "true";
}

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

function Editor({ data, loading }) {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true); // для анимации

  // Плавная смена текста loader
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => {
          let next;
          do {
            next = Math.floor(Math.random() * LOADING_PHRASES.length);
          } while (next === prev);
          return next;
        });
        setFade(true);
      }, 250); // время fade-out
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  // Инициализация Editor.js
  useEffect(() => {
    if (!containerRef.current || loading) return;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: containerRef.current,
        readOnly: true,
        data,
        autofocus: true,
        tools: {
          table: { class: Table, inlineToolbar: true },
          header: { class: Header, inlineToolbar: true },
          list: { class: EditorjsList, inlineToolbar: true },
          formula: { class: Formula, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
        },
        onReady: () => {
          renderAllFormulas(containerRef.current);
          containerRef.current
            .querySelectorAll(".cdx-quote__caption")
            .forEach((el) => el.remove());
        },
      });

      const captionObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of Array.from(m.addedNodes)) {
            if (node.nodeType !== Node.ELEMENT_NODE) continue;
            const el = node;
            if (el.matches && el.matches(".cdx-quote__caption")) el.remove();
            el.querySelectorAll &&
              el.querySelectorAll(".cdx-quote__caption").forEach((n) => n.remove());
          }
        }
      });
      captionObserver.observe(containerRef.current, { childList: true, subtree: true });

      const originalDestroy = editor.destroy && editor.destroy.bind(editor);
      editor.destroy = async function () {
        try {
          captionObserver.disconnect();
        } catch {}
        if (originalDestroy) await originalDestroy();
      };

      editorRef.current = editor;
    }

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
  }, [data, loading]);

  if (loading) {
    return (
      <div
        className="text-center py-20"
        ref={containerRef}
        style={{ minHeight: "200px" }}
      >
        <div
          className={`text-[var(--text-color)] text-sm transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {LOADING_PHRASES[currentPhraseIndex]}
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ minHeight: "400px" }} />;
}

export default memo(Editor);
