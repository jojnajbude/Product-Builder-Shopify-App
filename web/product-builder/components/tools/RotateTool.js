import Tool from "./Tool";

class RotateTool extends Tool {
  static icons = {
    against: `
      <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.53034 4.02642C7.72202 4.10729 7.92285 3.93233 7.869 3.73138L7.71656 3.16246C9.98422 2.55486 11.359 2.63675 12.284 3.17081C13.209 3.70488 13.9674 4.85456 14.575 7.1223C14.7179 7.65576 15.2663 7.97235 15.7997 7.8294C16.3332 7.68646 16.6498 7.13813 16.5068 6.60466C15.8605 4.19241 14.9171 2.38164 13.284 1.43876C11.6509 0.495888 9.61111 0.584285 7.19892 1.23061L7.04656 0.661976C6.99271 0.461028 6.73131 0.40992 6.60575 0.575792L5.04378 2.63921C4.94538 2.76919 4.99572 2.95706 5.14593 3.02044L7.53034 4.02642Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.56918 6.88022C0.768976 7.09463 0.294102 7.91714 0.508515 8.71734L2.83789 17.4107C3.0523 18.2109 3.8748 18.6857 4.675 18.4713L13.3683 16.142C14.1685 15.9275 14.6434 15.105 14.429 14.3048L12.0996 5.61151C11.8852 4.81131 11.0627 4.33644 10.2625 4.55085L1.56918 6.88022ZM2.56978 8.68266L4.64033 16.4101L12.3677 14.3395L10.2972 6.61211L2.56978 8.68266Z" fill="currentColor"/>
      </svg>
    `,
    by: `
      <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.46786 4.02642C9.27618 4.10729 9.07535 3.93233 9.1292 3.73138L9.28164 3.16246C7.01398 2.55486 5.63921 2.63675 4.71419 3.17081C3.78916 3.70488 3.03084 4.85456 2.42321 7.1223C2.28026 7.65576 1.73193 7.97234 1.19846 7.8294C0.664995 7.68646 0.348412 7.13812 0.491354 6.60466C1.13771 4.19241 2.08106 2.38164 3.71419 1.43876C5.34729 0.495888 7.38709 0.584285 9.79927 1.23061L9.95164 0.661976C10.0055 0.461028 10.2669 0.40992 10.3925 0.575792L11.9544 2.63921C12.0528 2.76919 12.0025 2.95706 11.8523 3.02044L9.46786 4.02642Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.429 6.88022C16.2292 7.09463 16.7041 7.91714 16.4897 8.71734L14.1603 17.4107C13.9459 18.2109 13.1234 18.6857 12.3232 18.4713L3.62986 16.142C2.82966 15.9275 2.35479 15.105 2.5692 14.3048L4.89857 5.61151C5.11299 4.81131 5.93549 4.33644 6.73569 4.55085L15.429 6.88022ZM14.4284 8.68266L12.3579 16.4101L4.63046 14.3395L6.70101 6.61211L14.4284 8.68266Z" fill="currentColor"/>
      </svg>
    `, 
  }

  static defaultValue = {
    value: 0
  }

  constructor() {
    super();

    this.label.setLabel(localization.tools.rotate.title);

    const icon = `
      <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.90175 6.29659C1.90175 9.34078 4.10895 11.4145 6.58746 11.8437C6.87109 11.8928 7.0612 12.1626 7.01209 12.4462C6.96298 12.7298 6.69324 12.9199 6.40962 12.8708C3.49796 12.3666 0.859375 9.91247 0.859375 6.29659C0.859375 4.75991 1.55849 3.55227 2.37493 2.63358C2.95978 1.97549 3.62888 1.44117 4.16699 1.03184L2.53059 1.03184C2.25444 1.03184 2.03059 0.80798 2.03059 0.531837C2.03059 0.255695 2.25444 0.0318374 2.53059 0.0318374L5.53059 0.0318373C5.80673 0.0318372 6.03059 0.255695 6.03059 0.531837L6.03059 3.53184C6.03059 3.80798 5.80673 4.03184 5.53059 4.03184C5.25444 4.03184 5.03059 3.80798 5.03059 3.53184L5.03059 1.68627L5.02907 1.68741L5.02899 1.68747L5.02898 1.68748L5.02896 1.68749C4.45749 2.11849 3.75912 2.6452 3.15408 3.32602C2.43955 4.13003 1.90175 5.10135 1.90175 6.29659ZM13.0094 6.70302C13.0094 3.69097 10.849 1.62942 8.40237 1.1701C8.11947 1.11699 7.93319 0.844602 7.9863 0.561701C8.03941 0.2788 8.3118 0.0925166 8.5947 0.145627C11.469 0.685223 14.0518 3.12587 14.0518 6.70302C14.0518 8.2397 13.3526 9.44735 12.5362 10.366C11.9514 11.0241 11.2823 11.5584 10.7442 11.9678L12.3806 11.9678C12.6567 11.9678 12.8806 12.1916 12.8806 12.4678C12.8806 12.7439 12.6567 12.9678 12.3806 12.9678L9.38059 12.9678C9.10444 12.9678 8.88059 12.7439 8.88059 12.4678L8.88059 9.46777C8.88059 9.19163 9.10444 8.96777 9.38059 8.96777C9.65673 8.96777 9.88059 9.19163 9.88059 9.46777L9.88059 11.3133L9.88215 11.3121C10.4536 10.8811 11.152 10.3544 11.7571 9.67359C12.4716 8.86958 13.0094 7.89826 13.0094 6.70302Z" fill="black"/>
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
          backgroundColor: {
            ...Studio.state.panel.tools.rotate,
            value: RotateTool.defaultValue
          }
        }
      }
    }, 'rotate tool - reset')
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rotate-tool');

    const againstClock = document.createElement('button');
    againstClock.innerHTML = RotateTool.icons.against;
    againstClock.classList.add('rotate-tool__button');

    const byClock = document.createElement('button');
    byClock.classList.add('rotate-tool__button');
    byClock.innerHTML = RotateTool.icons.by;

    const slider = this.slider = new RangeSlider({ min: 0, max: 360, defValue: 0 });
    slider.classList.add('rotate-tool__slider');

    againstClock.addEventListener('click', () => {
      const value = slider.getValue();

      switch (true) {
        case value <= 90:
          slider.setValue(0);
          break;
        case value <= 180:
          slider.setValue(90);
          break;
        case value <= 270:
          slider.setValue(180);
          break;
        case value <= 360:
          slider.setValue(270);
          break;   
      }
    })

    byClock.addEventListener('click', () => {
      const value = slider.getValue();

      switch (true) {
        case value >= 270:
          slider.setValue(360);
          break;  
        case value >= 180:
          slider.setValue(270);
          break;
        case value >= 90:
          slider.setValue(180);
          break;
        case value >= 0:
          slider.setValue(90);
          break; 
      }
    })

    slider.onChange(() => {
      Studio.utils.change({
        panel: {
          ...Studio.state.panel,
          tools: {
            ...Studio.state.panel.tools,
            rotate: {
              ...Studio.state.panel.tools.rotate,
              value: this.getValue()
            }
          }
        }
      }, 'rotate tool - set value')
    })

    wrapper.append(againstClock, slider.container, byClock);

    this.collapsible.inner.append(wrapper);
  }

  setValue(state) {
    const { value } = state;

    this.slider.setValue(value);
    setTimeout(() => {
    }, 10);
  }

  getValue() {
    return {
      value: this.slider.getValue()
    }
  }
}

export default RotateTool;