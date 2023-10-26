import Tool from "./Tool";

class LayoutTool extends Tool {
  static defaultValue = {
    layout: 'whole'
  }

  constructor() {
    super();

    this.collapsible.inner.classList.add('tool__layout-grid');

    this.label.setLabel(localization.tools.layout.title);

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2H8V7H13V2.5C13 2.22386 12.7761 2 12.5 2ZM13 8H8V13H12.5C12.7761 13 13 12.7761 13 12.5V8ZM7 7V2H2.5C2.22386 2 2 2.22386 2 2.5V7H7ZM2 8V12.5C2 12.7761 2.22386 13 2.5 13H7V8H2ZM2.5 1C1.67157 1 1 1.67157 1 2.5V12.5C1 13.3284 1.67157 14 2.5 14H12.5C13.3284 14 14 13.3284 14 12.5V2.5C14 1.67157 13.3284 1 12.5 1H2.5Z" fill="black"/>
      </svg>
    `;
    this.icon.setIcon(icon);
  }

  connectedCallback() {
    this.setAvailableLayouts();
  }

  setContent() {
    this.layouts = Object.keys(layouts)
      .map(layout => this.layoutIconTemplate(layout));

      for (const layout of this.layouts) {
        layout.append();
      }

    this.layouts[0].select();
  }

  getValue() {
    return {
      layout: this.selected.layoutId
    }
  }

  setAvailableLayouts() {
    const selectedBlock = Studio.state.view.blocks.find(block => block.selected || block.activeChild);

    if (!selectedBlock) {
      return;
    }

    this.layouts.forEach(icon => {
      const layout = layouts[icon.layoutId];

      if (layout.types.includes(selectedBlock.type) && !icon.isexists()) {
        icon.append();
      } else if (!layout.types.includes(selectedBlock.type)) {
        icon.remove();
      }
    })
  }

  setValue(state) {
    this.setAvailableLayouts();
    this.selected.unselect();

    if (!state || !state.layout) {
      return;
    }

    const { layout } = state;

    const toSelect = this.layouts.find(variant => variant.layoutId === layout);

    if (toSelect) {
      toSelect.select();
    }
  }

  layoutIconTemplate(layout) {
    const { icon: iconSVG } = layouts[layout];

    const icon = document.createElement('div');
    icon.classList.add('layout-icon');
    icon.setAttribute('data-layout', layout);

    const border = document.createElement('span');
    border.classList.add('layout__border');

    let layoutIcon = {};

    const select = () => {
      const selected = this.collapsible.inner.querySelector('.layout-icon.is-selected')

      if (selected) {
        selected.classList.remove('is-selected');
      }

      icon.classList.toggle('is-selected');

      this.selected = layoutIcon;

      if (!Studio.state) {
        return;
      }

      const panelState = Studio.state.panel;

      Studio.utils.change({
        panel: {
          ...panelState,
          tools: {
            ...panelState.tools,
            layout: {
              ...panelState.tools.layout,
              value: this.getValue()
            }
          }
        }
      }, 'layout tool');
    }

    const unselect = () => {
      icon.classList.toggle('is-selected');
    }

    icon.addEventListener('click', select);

    let removeTimer;

    icon.innerHTML = iconSVG;

    icon.append(border);

    layoutIcon = Object.assign(layoutIcon, {
      append: () => { 
        clearTimeout(removeTimer);
        this.collapsible.inner.append(icon);
      },
      icon,
      select,
      unselect,
      isexists: () => document.contains(icon),
      remove: () => icon.remove(),
      layoutId: layout
    })

    return layoutIcon
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          layout: {
            ...Studio.state.panel.tools.layout,
            value: LayoutTool.defaultValue
          }
        }
      }
    }, 'layout tool - reset')
  }
}

export default LayoutTool;