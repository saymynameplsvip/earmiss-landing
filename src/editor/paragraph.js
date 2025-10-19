import katex from "katex";

export default class ModernParagraph {
  static get toolbox() {
    return {
      title: 'Paragraph',
      icon: '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 12h10v1H2v-1zm9-4H3v1h8v-1zm3-4H0v1h14V4z"/></svg>'
    };
  }

  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.config = config || {};
    this.data = {
      text: data.text || ''
    };
    this.readOnly = readOnly;
    this.wrapper = undefined;
    this.textarea = undefined;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.textarea = document.createElement('div');
    this.textarea.classList.add('ce-paragraph');
    this.textarea.innerHTML = this.data.text;

    if (!this.readOnly) {
      this.textarea.contentEditable = true;

      // Показывать исходный текст при фокусе
      this.textarea.addEventListener('focus', () => {
        this.textarea.innerHTML = this.data.text;
      });

      // При потере фокуса — рендерить LaTeX обратно
      this.textarea.addEventListener('blur', () => {
        this.data.text = this.textarea.innerHTML;
        this.renderMath();
      });
    }

    // При первом отображении рендерим формулы
    this.renderMath();

    this.wrapper.appendChild(this.textarea);
    return this.wrapper;
  }

  save(blockContent) {
    return {
      text: blockContent.querySelector('div.ce-paragraph').innerHTML
    };
  }

  renderMath() {
    if (typeof katex === 'undefined') {
      console.warn('KaTeX is not loaded. Please include KaTeX script and CSS.');
      return;
    }

    let html = this.data.text;

    // display-формулы: $$...$$
    html = html.replace(/\$\$([^$]+)\$\$/g, (match, tex) => {
      try {
        return katex.renderToString(tex, { displayMode: true });
      } catch (e) {
        console.error(e);
        return match;
      }
    });

    // inline-формулы: $...$
    html = html.replace(/\$([^$]+)\$/g, (match, tex) => {
      try {
        return katex.renderToString(tex, { displayMode: false });
      } catch (e) {
        console.error(e);
        return match;
      }
    });

    this.textarea.innerHTML = html;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get sanitize() {
    return {
      br: true,
      b: true,
      a: true,
      i: true,
      strong: true,
      em: true,
      u: true,
      ol: true,
      ul: true,
      li: true
    };
  }

  static get isReadOnlySupported() {
    return true;
  }
}
