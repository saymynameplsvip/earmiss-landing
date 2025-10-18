// MathList.js
import katex from 'katex';
import 'katex/dist/katex.min.css';

const INLINE_RE = /\$(?!\$)([^$]+?)\$/g;       // $...$
const DISPLAY_RE = /\$\$([\s\S]+?)\$\$/g;     // $$...$$

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

export default class MathList {
  static get toolbox() {
    return {
      title: 'MathList',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 5h14v2H7zM7 11h14v2H7zM7 17h14v2H7zM3 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM3 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM3 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data = {}, api, readOnly = false }) {
    this.api = api;
    this.readOnly = readOnly;
    this.data = {
      items: Array.isArray(data.items) ? data.items.slice() : []
    };

    this._onItemFocus = this._onItemFocus.bind(this);
    this._onItemBlur = this._onItemBlur.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  render() {
    this.container = document.createElement('div');
    this.container.classList.add('cdx-list', 'ce-math-list');

    // Всегда ul с точками
    this.list = document.createElement('ul');
    this.list.style.listStyleType = 'disc';
    this.list.style.listStylePosition = 'outside';
    this.list.style.paddingLeft = '2em';
    this.list.style.margin = '0.5em 0';

    if (!this.data.items.length) this.data.items.push('');

    this.data.items.forEach((text) => {
      const li = this._createListItem(text);
      this.list.appendChild(li);
      if (!this.readOnly) {
        this._renderMathInListItem(li);
      } else {
        this._renderMathInListItem(li);
        li.contentEditable = false;
      }
    });

    this.container.appendChild(this.list);

    // CSS для bullets + Katex
    const style = document.createElement('style');
    style.textContent = `
      .ce-math-list li {
        display: list-item !important;
        list-style-type: disc !important;
        list-style-position: outside !important;
        white-space: pre-wrap;
        margin: 0.2em 0;
      }

      .ce-math-list li:focus {
        outline: none;
      }

      .ce-math-list li .katex {
        display: inline-block; /* важно, чтобы bullets отображались */
      }

      .ce-math-list li .katex-display {
        display: block;
        margin: 0.2em 0;
      }
    `;
    this.container.appendChild(style);

    return this.container;
  }

  _createListItem(text = '') {
    const li = document.createElement('li');
    li.className = 'ce-math-list__item';
    li.dataset.raw = text;
    li.contentEditable = !this.readOnly;
    li.setAttribute('role', 'textbox');
    li.setAttribute('aria-multiline', 'true');
    li.innerText = text;

    if (!this.readOnly) {
      li.addEventListener('focus', this._onItemFocus);
      li.addEventListener('blur', this._onItemBlur);
      li.addEventListener('keydown', this._onKeyDown);
    }

    return li;
  }

  _onItemFocus(e) {
    const li = e.currentTarget;
    if (!li.dataset.raw) li.dataset.raw = li.innerText;
    li.innerText = li.dataset.raw;
    li.style.display = 'list-item';
  }

  _onItemBlur(e) {
    const li = e.currentTarget;
    li.dataset.raw = li.innerText;
    this._renderMathInListItem(li);
  }

  _onKeyDown(e) {
    const li = e.currentTarget;

    if (e.key === 'Enter') {
      e.preventDefault();
      const sel = window.getSelection();
      const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
      let caretOffset = 0;
      if (range) {
        const preRange = range.cloneRange();
        preRange.selectNodeContents(li);
        preRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preRange.toString().length;
      }
      const text = li.dataset.raw || li.innerText || '';
      const before = text.slice(0, caretOffset);
      const after = text.slice(caretOffset);

      li.dataset.raw = before;
      li.innerText = before;

      const newLi = this._createListItem(after);
      li.parentNode.insertBefore(newLi, li.nextSibling);
      this._renderMathInListItem(li);
      newLi.focus();
      this._placeCaretAt(newLi, 0);
      return;
    }

    if (e.key === 'Backspace' && li.innerText.length === 0) {
      e.preventDefault();
      const prev = li.previousElementSibling;
      if (prev) {
        prev.focus();
        this._placeCaretAt(prev, prev.dataset.raw.length);
        li.remove();
      }
    }
  }

  _renderMathInListItem(li) {
    li.style.display = 'list-item';
    const raw = li.dataset.raw || '';
    let html = escapeHtml(raw);

    html = html.replace(DISPLAY_RE, (m, expr) => {
      try {
        return katex.renderToString(expr, { displayMode: true, throwOnError: false });
      } catch {
        return `<span class="katex-error">${escapeHtml(m)}</span>`;
      }
    });

    html = html.replace(INLINE_RE, (m, expr) => {
      try {
        return katex.renderToString(expr, { displayMode: false, throwOnError: false });
      } catch {
        return `<span class="katex-error">${escapeHtml(m)}</span>`;
      }
    });

    li.innerHTML = html || '<br>';
    li.dataset.raw = raw;
    li.contentEditable = true;
  }

  _placeCaretAt(el, pos) {
    el.focus();
    const range = document.createRange();
    const sel = window.getSelection();

    function getTextNodeAndOffset(n, offset) {
      if (n.nodeType === Node.TEXT_NODE) return { node: n, offset };
      for (const child of n.childNodes) {
        const len = child.textContent.length;
        if (offset <= len) return getTextNodeAndOffset(child, offset);
        offset -= len;
      }
      return { node: n, offset: n.childNodes.length };
    }

    const res = getTextNodeAndOffset(el, pos);
    try {
      range.setStart(res.node, res.offset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } catch {}
  }

  save(blockContent) {
    const items = Array.from(blockContent.querySelectorAll('li')).map(li => li.dataset.raw || li.innerText);
    return { items };
  }
}
