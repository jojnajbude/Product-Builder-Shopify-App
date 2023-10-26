import Tool from "./Tool";

class CropTool extends Tool {
  static defaultValue = {
    value: 0
  }

  constructor() {
    super();

    this.label.setLabel(localization.tools.crop.title);

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 1.75436e-06C3.77614 1.74229e-06 4 0.223859 4 0.500002L4 3.00006L11.5 3.00006C11.7761 3.00006 12 3.22392 12 3.50006L12 11.0001L14.5 11C14.7761 11 15 11.2238 15 11.5C15 11.7761 14.7762 12 14.5 12L12 12.0001L12 14.5C12 14.7761 11.7761 15 11.5 15C11.2239 15 11 14.7761 11 14.5L11 12.0001L3.5 12.0001C3.22386 12.0001 3 11.7762 3 11.5001L3 4.00005L0.499989 4C0.223847 4 -6.10541e-06 3.77613 -5.02576e-07 3.49999C5.13006e-06 3.22385 0.223867 3 0.50001 3L3 3.00005L3 0.500002C3 0.223859 3.22386 1.76643e-06 3.5 1.75436e-06ZM4 4.00006L4 11.0001L11 11.0001L11 4.00006L4 4.00006Z" fill="black"/>
      </svg>
    `

    this.icon.setIcon(icon);
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          crop: {
            ...Studio.state.panel.tools.crop,
            value: CropTool.defaultValue
          }
        }
      }
    }, 'crop tool - reset')
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('crop-tool');

    const slider = this.slider = new RangeSlider();
    slider.classList.add('crop-tool__slider');

    const cropValue = (() => {
      const container = document.createElement('div');
      container.classList.add('crop-tool__value');

      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 100;
      input.classList.add('crop-tool__value-input');

      container.append(input);

      return {
        container,
        setValue: (value) => {
          if (typeof value === 'number' && value >= 0 && value <= 100) {
            input.value = value;
          }
        },
        onChange: (callback) => {
          input.addEventListener('input', callback);
        },
        getValue: () => {
          return +input.value;
        }
      }
    })();

    slider.setValue(0);
    cropValue.setValue(slider.getValue());

    slider.onChange(() => {
      cropValue.setValue(slider.getValue());
    });

    cropValue.onChange(() => {
      slider.setValue(cropValue.getValue());
    });

    slider.onChange(() => {
      Studio.utils.change({
        panel: {
          ...Studio.state.panel,
          tools: {
            ...Studio.state.panel.tools,
            crop: {
              ...Studio.state.panel.tools.crop,
              value: this.getValue()
            }
          }
        }
      }, 'crop tool - set value')
    })

    wrapper.append(slider.container, cropValue.container);

    this.collapsible.inner.append(wrapper);
  }

  create(state) {
    this._defaultCreate(state);
  }

  getValue() {
    return {
      value: this.slider.getValue()
    }
  }

  setValue(state) {
    const { value } = state;

    this.slider.setValue(value);
  }
}

export default CropTool;