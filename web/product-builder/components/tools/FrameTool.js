import Tool from "./Tool";

class FrameTool extends Tool {
  static frames = {
    black: {
      label: 'Black',
      value: 'black',
      default: true
    },
    white: {
      label: 'White',
      value: 'white',
    }
  }

  static defaultValue = {
    value: 'black'
  }

  constructor() {
    super();

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5V4H5V1.5C5 1.22386 4.77614 1 4.5 1C4.22386 1 4 1.22386 4 1.5V4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H4V10H1.5C1.22386 10 1 10.2239 1 10.5C1 10.7761 1.22386 11 1.5 11H4V13.5C4 13.7761 4.22386 14 4.5 14C4.77614 14 5 13.7761 5 13.5V11H10V13.5C10 13.7761 10.2239 14 10.5 14C10.7761 14 11 13.7761 11 13.5V11H13.5C13.7761 11 14 10.7761 14 10.5C14 10.2239 13.7761 10 13.5 10H11V5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H11V1.5ZM10 10V5H5V10H10Z" fill="black"/>
      </svg>
    `;

    this.label.setLabel(localization.tools.frame.title);

    this.icon.setIcon(icon);
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('background-tool');

    const frameButtons = this.buttons = Object.keys(FrameTool.frames)
      .map((color) => this.frameOptionTemplate(FrameTool.frames[color]))
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
                frame: {
                  ...Studio.state.panel.tools.frame,
                  value: this.getValue()
                }
              }
            }
          }, 'frame tool - set value');
        })

        return button;
      });

    wrapper.append(...frameButtons);

    this.collapsible.inner.append(wrapper);
  }

  frameOptionTemplate(color) {
    const { label, value } = color;

    const button = document.createElement('button');
    button.classList.add('background-tool__button');
    button.setAttribute('data-frame', JSON.stringify(color));
    button.setAttribute('data-frame-value', value);

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

    const btnToSelect = this.collapsible.inner.querySelector(`button[data-frame-value="${value}"`);

    if (btnToSelect) {
      btnToSelect.classList.add('is-selected');
    }
  }

  getValue() {
    const selectedFrame = this.collapsible.container.querySelector('button.is-selected');

    if (selectedFrame) {
      const frame = JSON.parse(selectedFrame.getAttribute('data-frame'));

      return {
        ...frame
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
          frame: {
            ...Studio.state.panel.tools.frame,
            value: FrameTool.defaultValue
          }
        }
      }
    }, 'frame tool - reset')
  }
}

export default FrameTool;