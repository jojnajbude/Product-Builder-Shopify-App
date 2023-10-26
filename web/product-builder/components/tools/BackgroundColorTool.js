import Tool from "./Tool";

class BackgroundColorTool extends Tool {
  static colors = {
    black: {
      label: 'Black',
      value: 'rgb(0,0,0)',
      whiteFont: true,
    },
    white: {
      label: 'White',
      value: 'rgb(255,255,255)',
      default: true
    },
    red: {
      label: 'Red',
      value: 'rgb(255,40,40)',
      whiteFont: true,
    },
    orange: {
      label: 'Orange',
      value: 'rgb(255,164,28)',
      whiteFont: true,
    },
    yellow: {
      label: 'Yellow',
      value: 'rgb(255,232,28)'
    },
    green: {
      label: 'Green',
      value: 'rgb(0,255,133)'
    },
    blue: {
      label: 'Blue',
      value: 'rgb(40,165,255)',
      whiteFont: true,
    },
    indigo: {
      label: 'Indigo',
      value: 'rgb(0, 41, 255)',
      whiteFont: true,
    },
    purple: {
      label: 'Purple',
      value: 'rgb(255,40,195)',
      whiteFont: true,
    }
  }

  static defaultValue = {
    label: 'White',
    value: 'rgb(255,255,255)',
    whiteFont: false
  }

  constructor() {
    super();

    this.label.setLabel(localization.tools.background.title)

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.85416 1.48922C7.6589 1.29396 7.34231 1.29396 7.14705 1.48922L1.4902 7.14607C1.29493 7.34134 1.29493 7.65792 1.4902 7.85318L7.14705 13.51C7.34231 13.7053 7.6589 13.7053 7.85416 13.51L13.511 7.85318C13.7063 7.65792 13.7063 7.34134 13.511 7.14607L7.85416 1.48922ZM7.50049 2.55L2.55086 7.49963L7.50049 12.4493V2.55Z" fill="black"/>
      </svg>
    `;

    this.icon.setIcon(icon);
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('background-tool');

    const colorButtons = this.buttons = Object.keys(BackgroundColorTool.colors)
      .map((color) => this.colorOptionTemplate(BackgroundColorTool.colors[color]))
      .map(button => {
        button.addEventListener('click', () => {
          const toUnselect = wrapper.querySelector('button.is-selected');

          if (toUnselect) {
            toUnselect.classList.remove('is-selected');
          }

          button.classList.add('is-selected');

          Studio.utils.change({
            panel: {
              ...Studio.state.panel,
              tools: {
                ...Studio.state.panel.tools,
                backgroundColor: {
                  ...Studio.state.panel.tools.backgroundColor,
                  value: this.getValue()
                }
              }
            }
          }, 'background tool - set value');
        })

        return button;
      });

    wrapper.append(...colorButtons);

    this.collapsible.inner.append(wrapper);
  }

  colorOptionTemplate(color) {
    const { label, value } = color;

    const button = document.createElement('button');
    button.classList.add('background-tool__button');
    button.setAttribute('data-color', JSON.stringify(color));
    button.setAttribute('data-color-value', value);

    const icon = document.createElement('div');
    icon.classList.add('background-tool__icon');
    icon.style.backgroundColor = value;

    if (color.default) {
      button.classList.add('is-selected');
    }

    const title = document.createElement('div');
    title.classList.add('background-tool__title');
    title.textContent = label;

    button.append(icon, title);

    return button;
  }

  setValue(state) {
    const { value } = state;

    const toUnselect = this.collapsible.inner.querySelector(`button.is-selected`);

    if (toUnselect) {
      toUnselect.classList.remove('is-selected');
    }

    const btnToSelect = this.collapsible.inner.querySelector(`button[data-color-value="${value}"`);

    if (btnToSelect) {
      btnToSelect.classList.add('is-selected');
    }

  }

  getValue() {
    const selectedColor = this.collapsible.container.querySelector('button.is-selected');

    if (selectedColor) {
      const color = JSON.parse(selectedColor.getAttribute('data-color'));

      return {
        ...color
      }
    }
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          backgroundColor: {
            ...Studio.state.panel.tools.backgroundColor,
            value: BackgroundColorTool.defaultValue
          }
        }
      }
    }, 'background tool - reset')
  }
}

export default BackgroundColorTool;