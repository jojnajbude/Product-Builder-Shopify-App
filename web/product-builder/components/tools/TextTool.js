import Tool from "./Tool";

class TextTool extends Tool {
  static icons = {
    bold: `
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.183181 10.8809V0.347155H4.41171C5.50521 0.347155 6.33787 0.602973 6.9097 1.11461C7.49156 1.61622 7.7825 2.26329 7.7825 3.05582C7.7825 3.71794 7.60192 4.24964 7.24076 4.65093C6.88964 5.04218 6.45826 5.30803 5.94662 5.44848C6.54855 5.56886 7.04514 5.86983 7.43639 6.35137C7.82764 6.82288 8.02327 7.37464 8.02327 8.00666C8.02327 8.83933 7.7223 9.52653 7.12038 10.0683C6.51845 10.61 5.66572 10.8809 4.56219 10.8809H0.183181ZM2.10934 4.77131H4.1258C4.66753 4.77131 5.08386 4.64591 5.37479 4.39511C5.66572 4.1443 5.81119 3.78817 5.81119 3.32669C5.81119 2.88528 5.66572 2.53917 5.37479 2.28837C5.09389 2.02753 4.66753 1.89711 4.0957 1.89711H2.10934V4.77131ZM2.10934 9.31585H4.26123C4.83306 9.31585 5.27447 9.18543 5.58547 8.9246C5.90649 8.65373 6.06701 8.27753 6.06701 7.79599C6.06701 7.30442 5.90148 6.91818 5.57042 6.63728C5.23936 6.35638 4.79293 6.21593 4.23113 6.21593H2.10934V9.31585Z" fill="currentColor"/>
      </svg>
    `,
    italic: `
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7.21094" y="4.57031" width="7.37654" height="1.47531" fill="currentColor"/>
        <rect x="4.25781" y="12.6836" width="7.37654" height="1.47531" fill="currentColor"/>
        <rect x="6.47656" y="13.6055" width="9.24965" height="1.47531" transform="rotate(-65 6.47656 13.6055)" fill="currentColor"/>
      </svg>
    `,
    underline: `    
      <svg width="18" height="18" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4.57031V10.1027C6 10.1027 6.36883 12.6845 8.95062 12.6845C11.5324 12.6845 11.9012 10.1027 11.9012 10.1027V4.57031" stroke="currentColor" stroke-width="1.77037"/>
        <rect x="3.05469" y="15.6367" width="11.8025" height="1.47531" fill="currentColor"/>
      </svg>
    `,
    left: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.664062 3.01172H14.827" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 6.16016H10.9644" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 9.30859H14.827" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 12.457H10.9644" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    center: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.07031 3.01172H15.2333" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 6.16016H13.3003" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.07031 9.30859H15.2333" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 12.457H13.3003" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    right: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.476562 3.01172H14.6395" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.33594 6.16016H14.6363" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.476562 9.30859H14.6395" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.33594 12.457H14.6363" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  }

  static fonts = [
    'Roboto',
    'Mooli',
    'Inter',
    'Skranji',
    'Quicksand',
    'Lobster Two',
    'DM Sans'
  ];

  static defaultValue = {
    align: 'center',
    font: TextTool.fonts[0],
    fontStyle: {
      bold: false,
      italic: false,
      underline: false
    },
    text: ``
  }

  constructor() {
    super();

    this.container.classList.add('center');

    this.label.setLabel(localization.tools.text.title);

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.95078 2.9498L3.95078 4.49977C3.95078 4.74829 3.74931 4.94977 3.50078 4.94977C3.25225 4.94977 3.05078 4.74829 3.05078 4.49977V2.49982C3.05078 2.45225 3.05816 2.4064 3.07185 2.36336C3.12963 2.18154 3.29983 2.0498 3.50079 2.0498H11.5008C11.6561 2.0498 11.7931 2.1285 11.8739 2.24821C11.9225 2.32003 11.9508 2.40661 11.9508 2.4998L11.9508 2.49982V4.49977C11.9508 4.74829 11.7493 4.94977 11.5008 4.94977C11.2523 4.94977 11.0508 4.74829 11.0508 4.49977V2.9498H8.05079V12.0498H9.25513C9.50366 12.0498 9.70513 12.2513 9.70513 12.4998C9.70513 12.7483 9.50366 12.9498 9.25513 12.9498H5.75513C5.50661 12.9498 5.30513 12.7483 5.30513 12.4998C5.30513 12.2513 5.50661 12.0498 5.75513 12.0498H6.95079V2.9498H3.95078Z" fill="black"/>
      </svg>
    `;

    this.icon.setIcon(icon);
  }

  selectorTemplate(data) {
    if (!data && !data.options) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('text-tool__selector-wrapper');

    const selector = document.createElement('select');
    selector.classList.add('text-tool__selector');

    data.options
      .map(option => {
        const container = document.createElement('option');

        container.value = option;
        container.textContent = option;

        selector.append(container);

        return container;
      });

    wrapper.append(selector);

    const iconHTML = `
      <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.01493 3.57255L0.359375 0.916992H5.67049L3.01493 3.57255Z" fill="#888888"/>
      </svg>
    `;

    const icon = domReader.parseFromString(iconHTML, 'image/svg+xml').querySelector('svg');

    wrapper.append(icon);

    return {
      wrapper,
      disable: () => selector.toggleAttribute('disabled'),
      setValue: (value) => {
        const toSet = selector.querySelector(`option[value="${value}"]`);

        if (toSet) {
          selector.value = value;
        }
      },
      getValue: () => selector.value,
      selector,
      onChange: (callback) => {
        selector.addEventListener('change', callback.bind(this));
      }
    };
  }

  setContent() {
    const container = document.createElement('div');
    this.contentWrapper = container;
    container.classList.add('text-tool')


    const text = document.createElement('textarea');
    text.classList.add('text-tool__text');

    text.addEventListener('input', this.onTextInput.bind(this));

    const header = this.header = this.headerContent();
    const tools = this.tools = this.toolsContent();

    container.append(
      header.wrapper,
      tools.container,
      text
    );

    this.text = text;

    this.values = {
      font: this.selectFont.getValue(),
      text: text.value,
      align: tools.getAlign(),
      fontStyle: tools.getFontStyle()
    }

    this.collapsible.inner.append(container);
  }

  headerContent() {
    const header = document.createElement('div');
    header.classList.add('text-tool__header');

    // const selectType = this.selectorTemplate({ options: [
    //   'Paragraph',
    //   'Line'
    // ]});

    // selectType.disable();

    // this.selectType = selectType;

    const selectFont = this.selectorTemplate({ options: TextTool.fonts});

    this.selectFont = selectFont;

    header.append(selectFont.wrapper);

    selectFont.onChange(this.onFontChange);

    return {
      wrapper: header,
      selectFont: {
        selector: selectFont.selector,
        value: selectFont.value
      }
    };
  }

  toolsContent() {
    this.groupButtons = {
      align: ['left', 'center', 'right']
    }

    const tools = document.createElement('div');
    tools.classList.add('text-tool__tools');

    const textStyle = document.createElement('div');
    textStyle.classList.add('text-tool__text-style', 'text-tool__item')

    const getToolButton = (value, icon, group, isdefault) => {
      const button = document.createElement('button');
      button.classList.add('text-tool__button');
      button.setAttribute('data-button-value', value);
      button.innerHTML = icon;

      if (isdefault) {
        button.classList.add('is-active');
      }

      if (group) {
        button.setAttribute('data-button-group', group);
      }

      button.addEventListener('click', () => {
        if (button.hasAttribute('data-button-group')) {
          const toUnselect = this.contentWrapper.querySelector(`button[data-button-group="${group}"].is-active`);

          if (toUnselect) {
            toUnselect.classList.remove('is-active');
          }
        }

        button.classList.toggle('is-active');

        this.onToolsChange(button);
      })

      return button
    }

    const boldStyle = getToolButton('bold', TextTool.icons.bold);
    const italicStyle = getToolButton('italic', TextTool.icons.italic);
    const underlineStyle = getToolButton('underline', TextTool.icons.underline);

    textStyle.append(boldStyle, italicStyle, underlineStyle);

    const textAlign = document.createElement('div');
    textAlign.classList.add('text-tool__text-align', 'text-tool__item');

    const leftAlign = getToolButton('left', TextTool.icons.left, 'align');
    const centerAlign = getToolButton('center', TextTool.icons.center, 'align', true);
    const rightAlign = getToolButton('right', TextTool.icons.right, 'align');

    textAlign.append(leftAlign, centerAlign, rightAlign);

    tools.append(textStyle, textAlign);

    return {
      container: tools,
      getAlign: () => {
        const activeAlign = textAlign.querySelector('button.is-active[data-button-group="align"');
        if (activeAlign) {
          return activeAlign.dataset.buttonValue;
        }

        return null;
      },
      setAlign: (align) => {
        const alignToUnset = tools.querySelector('button[data-button-group="align"].is-active');

        if (alignToUnset) {
          alignToUnset.classList.remove('is-active');
        }

        const alignToSet = tools.querySelector(`button[data-button-value="${align}"`);

        if (alignToSet) {
          alignToSet.classList.add('is-active');
        }
      },
      getFontStyle: () => {
        const isBold = textStyle.querySelector('button.is-active[data-button-value="bold"');
        const isItalic = textStyle.querySelector('button.is-active[data-button-value="italic"');
        const isUnderline = textStyle.querySelector('button.is-active[data-button-value="underline"');

        return {
          bold: isBold ? true : false,
          italic: isItalic ? true : false,
          underline: isUnderline ? true : false
        }
      },
      setFontStyle: ({ bold, italic, underline }) => {
        if (bold) {
          boldStyle.classList.add('is-active');
        } else {
          boldStyle.classList.remove('is-active');
        }

        if (italic) {
          italicStyle.classList.add('is-active');
        } else {
          italicStyle.classList.remove('is-active');
        }

        if (underline) {
          underlineStyle.classList.add('is-active');
        } else {
          underlineStyle.classList.remove('is-active');
        }
      }
    }
  }

  onToolsChange(button) {
    if (button.hasAttribute('data-button-group')) {
      switch (button.dataset.buttonGroup) {
        case 'align':
          Studio.utils.change({
            panel: {
              ...Studio.state.panel,
              tools: {
                ...Studio.state.panel.tools,
                text: {
                  ...Studio.state.panel.tools.text,
                  value: this.getStateValue({ align: button.dataset.buttonValue })
                }
              }
            }
          }, 'text tool')
        break;
      }

      return;
    }

    const fontStyle = this.tools.getFontStyle();

    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ fontStyle })
          }
        }
      }
    }, 'font style changed')    
  }

  onFontChange() {
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ font: this.selectFont.getValue() })
          }
        }
      }
    }, 'font change')
  }

  onTextInput(event) {
    this.text.style.height = (this.text.scrollHeight) + 'px';

    const isLine = Studio.state.view.blocks
      .filter(block => block.selected || block.activeChild)
      .some(block => block.childBlocks.some(child => child.isLine));

    const lines = Math.min(...Studio.state.view.blocks
      .filter(block => block.selected || block.activeChild)
      .filter(block => block.childBlocks.some(child => child.type === 'text'))
      .map(block => block.childBlocks.filter(child => child.type === 'text' && child.lines))
      .reduce((txts, blockTxts) => [...txts, ...blockTxts], [])
      .map(text => text.lines))

    const currentLines = this.text.value.split('\n').length;

    if (lines && lines < currentLines) {
      this.text.value = this.text.value
        .split('\n')
        .filter(text => text)
        .filter((_, idx) => idx < lines)
        .join('\n');
    }
      
    const { value } = this.text;

    const maxSize = this.maxSize !== Infinity
      ? this.maxSize
      : isLine ? 20 : 300;

    if (lines) {
      const newValue = value.split('\n')
        .map(line => {
          if (line.length > maxSize) {
            return line.substring(0, maxSize);
          }

          const WCount = line.split('')
            .filter(x => x.toLowerCase() === 'w').length;

          if (WCount > 5) {
            return line.substring(0, maxSize - 5);
          }
          
          return line;
        })
        .join('\n');

      this.text.value = newValue;

      this.text.focus();
      this.text.setSelectionRange(this.text.value.length, this.text.value.length);
    } else if (value.length > maxSize && isLine) {
      this.text.value = value.substring(0, maxSize);

      this.text.focus();
      this.text.setSelectionRange(this.text.value.length, this.text.value.length);
    } else if (!isLine && value.length > maxSize) {
      this.text.value = value.substring(0, maxSize);
      
      this.text.focus();
      this.text.setSelectionRange(this.text.value.length, this.text.value.length);
    }

    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ text: this.text.value })
          }
        }
      }
    }, 'text tool - on text input')
  }

  getStateValue(state) {
    return {
      ...Studio.state.panel.tools.text.value,
      ...state
    }
  }

  setValue(value) {
    const isLine = Studio.state.view.blocks
      .filter(block => block.selected || block.activeChild)
      .some(block => block.childBlocks.some(child => child.isLine));

    const textAreas = Studio.state.view.blocks
      .filter(block => block.activeChild || block.selected)
      .map(block => {

        return block.childBlocks
          .filter(child => child.type === 'text' 
            && child.maxSize
            && typeof child.maxSize === 'number'
          );
      }
      )
      .map(children => children.map(child => child.maxSize))
      .reduce((arr, children) => [...arr, ...children], []);

    this.maxSize = Math.min(...textAreas);

    // if (isLine) {
    //   this.selectType.setValue('Line');
    // } else {
    //   this.selectType.setValue('Paragraph');
    // }

    const { text, fontStyle, align, font } = value;

    if (typeof text === 'string') {
      this.text.value = text;
    }

    if (align) {
      this.tools.setAlign(align);
      
      this.container.classList.remove('center', 'right', 'left');

      this.container.classList.add(align);
    }

    if (fontStyle) {
      this.tools.setFontStyle(fontStyle);
    }

    if (font) {
      this.selectFont.setValue(font);
    }
  }

  getValue() {
    return {
      text: this.values.text,
      align: this.values.align,
      fontStyle: this.values.fontStyle,
      font: this.values.font,
      maxSize: this.maxSize
    }
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: TextTool.defaultValue
          }
        }
      }
    }, 'text tool - reset')
  }
}

export default TextTool;