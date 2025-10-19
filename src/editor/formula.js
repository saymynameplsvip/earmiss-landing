import katex from "katex";
import "katex/dist/katex.min.css";

export default class Formula {
  static get toolbox() {
    return {
      title: "Формула",
      icon: `<svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 3H5v2h14V3m-3 6h-4l-3.6 10H9v2h6v-2h-2l3.6-10H16V9Z"/>
      </svg>`
    };
  }

  constructor({ data, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      text: data.text || ""
    };
    this.wrapper = null;
    this.editor = null;
    this.isRendered = false;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("cdx-formula");

    this.editor = document.createElement("div");
    this.editor.classList.add("cdx-formula__editor");
    this.editor.contentEditable = !this.readOnly;
    this.editor.innerText = this.data.text;

    this.wrapper.appendChild(this.editor);

    if (!this.readOnly) {
      // При фокусе — показать сырой LaTeX
      this.editor.addEventListener("focus", () => {
        if (this.isRendered) {
          this.editor.innerText = this.data.text;
          this.isRendered = false;
        }
      });

      // При потере фокуса — отрисовать KaTeX
      this.editor.addEventListener("blur", () => {
        this.data.text = this.editor.innerText.trim();
        this.renderFormula();
      });
    }

    // Первичная отрисовка
    this.renderFormula();

    return this.wrapper;
  }

  renderFormula() {
    if (this.readOnly || !this.data.text.trim()) return;

    try {
      const html = katex.renderToString(this.data.text, { displayMode: true });
      this.editor.innerHTML = html;
      this.isRendered = true;
    } catch (err) {
      console.error("KaTeX render error:", err);
      this.editor.innerText = this.data.text; // fallback
    }
  }

  save() {
    return {
      text: this.data.text
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get sanitize() {
    return {
      br: true,
      b: true,
      i: true,
      u: true,
      span: true,
      div: true
    };
  }
}
