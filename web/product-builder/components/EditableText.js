class EditableText extends HTMLElement {
  static defaultValue = TextTool.defaultValue;

  static ToolList = ['text'];

  static get observedAttributes() {
    return ['font'];
  }

  constructor() {
    super();

    this.editableArea = document.createElement('span');
    this.editableArea.classList.add('textarea');

    this.editableArea.innerHTML = 'Add your description here';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'font':
        this.style.fontFamily = `${newValue}, serif`;
        break;
    }
  }

  connectedCallback() {
    this.classList.add('product-element__text', 'textarea-container');
    this.toggleAttribute('editable-text')

    if (!this.getAttribute('child-block')) {
      this.setAttribute('child-block', uniqueID.childBlock());
    }

    if (!this.hasAttribute('text-align')) {
      this.setAttribute('text-align', 'center');
    }

    if (!this.hasAttribute('is-bold')) {
      this.setAttribute('is-bold', false);
    }

    if (!this.hasAttribute('is-italic')) {
      this.setAttribute('is-italic', false);
    }

    if (!this.hasAttribute('is-underline')) {
      this.setAttribute('is-underline', false);
    }

    if (!this.hasAttribute('font')) {
      this.setAttribute('font', Studio.state.panel.tools.text.value.font);
    }

    this.append(this.editableArea);

    if (this.hasAttribute('line')) {
      this.editableArea.classList.add('line');
      this.observer = this.observeSpan(this.editableArea);
    }

    this.addEventListener('click', (event) => {
      Studio.studioView.setSelectedChild(this, event.shiftKey);
      Studio.panel.tools.focusOnTab('edit');
    })
  }

  observeSpan = (element) => {
    const mutate = (mutations) => {
      mutations.forEach(mutation => {
        const { textContent } = mutation.target;

        const range = document.createRange();
        const selection = document.getSelection();
        const textArr = textContent.split('');

        if (textArr.length > 35 && this.classList.contains('line')) {
          const maxSize = this.hasAttribute('max-size') ? this.getAttribute('max-size') : 35;

          mutation.target.textContent = textContent.substring(0, maxSize);
          range.setStartAfter(element.lastChild);
          range.collapse(true);

          selection.removeAllRanges();
          selection.addRange(range);

        } else if (textArr.length > 300) {
          mutation.target.textContent = textContent.substring(0, 300);
          range.setStartAfter(element.lastChild);
          range.collapse(true);

          selection.removeAllRanges();
          selection.addRange(range);
        }
      })
    }

    const observer = new MutationObserver(mutate);
    const config = { characterData: true, attributes: false, childList: false, subtree: true };

    observer.observe(element, config);

    return observer;
  }

  select() {
    this.classList.add('is-selected');
  }

  unselect() {
    this.classList.remove('is-selected');
  }

  getToolsList() {
    return ['text'];
  }

  setValue(settings) {
    const { text, align, fontStyle, font, maxSize } = settings;

    if (text) {
      this.editableArea.innerHTML = this.formatText(text);
    } else {
      this.editableArea.innerHTML = this.formatText(localization.tools.text.defaultValue);
    }

    if (maxSize) {
      this.setAttribute('max-size', maxSize);
    }

    if (align) {
      this.setAttribute('text-align', align);
    }

    if (fontStyle) {
      const { bold, italic, underline } = fontStyle;

      if (typeof bold === 'boolean') {
        this.setAttribute('is-bold', bold);
      }

      if (typeof italic === 'boolean') {
        this.setAttribute('is-italic', italic);
      }

      if (typeof underline === 'boolean') {
        this.setAttribute('is-underline', underline);
      }
    }

    if (font) {
      this.setAttribute('font', font);
    }
  }

  formatText(text) {
    if (text === '') {
      return '';
    }

    const lines = text.split('\n');

    const paragraph = lines.map(line => {
      const p = document.createElement('p');

      p.textContent = line;

      return p;
    });

    return paragraph.map(p => p.outerHTML).join('');
  }

  getValue() {
    const text = this.editableArea.querySelectorAll('p')
      .map(p => p.textContent)
      .join('\n');

    return {
      text: text,
      align: this.getAttribute('text-align'),
      fontStyle: {
        bold: JSON.parse(this.getAttribute('is-bold')),
        italic: JSON.parse(this.getAttribute('is-italic')),
        underline: JSON.parse(this.getAttribute('is-underline')),
      }
    }
  }

  setDefaultText(text) {
    this.editableArea.innerHTML = text;
  }
}
customElements.define('editable-text', EditableText);

export default EditableText;