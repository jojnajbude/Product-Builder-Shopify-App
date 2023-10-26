class Tool {
  static selectors = {
    editList: '[data-tools-list]'
  }

  constructor(label) {
    this.editList = document.querySelector(Tool.selectors.editList);

    this.timer = {
      in: null,
      out: null
    };

    this.container = document.createElement('div');
    this.container.classList.add('tool', 'page__tool');

    this.icon = (() => {
      const icon = document.createElement('span');

      icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M6.798 2.884a7.002 7.002 0 0 1 9.294 8.565l4.394 3.718a3.76 3.76 0 1 1-5.3 5.3l-3.717-4.394a7.002 7.002 0 0 1-8.565-9.295c.358-.894 1.48-1.007 2.063-.373L8.17 9.883l1.446-.288l.29-1.449l-3.48-3.198c-.634-.583-.522-1.706.373-2.064ZM8.805 4.42l2.763 2.54c.322.296.466.738.38 1.165l-.47 2.354a1.25 1.25 0 0 1-.982.981l-2.35.467a1.25 1.25 0 0 1-1.164-.38L4.438 8.785a5.002 5.002 0 0 0 6.804 5.25a1.257 1.257 0 0 1 1.422.355l4.05 4.786a1.76 1.76 0 1 0 2.48-2.48l-4.785-4.05a1.257 1.257 0 0 1-.355-1.422a5.001 5.001 0 0 0-5.25-6.804Z"/></g></svg>
      `;

      return {
        container: icon,
        setIcon: (svg) => icon.innerHTML = svg
      }
    })();

    this.label = this.initLabel('Label');

    if (label) {
      this.label.setLabel(label);
    }

    this.dropdownIcon = (() => {
      const plus = `
        <svg class="tool__plus" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="black"/>
        </svg>
      `;

      const minus = `
        <svg class="tool__minus" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="black"/>
        </svg>
      `;

      const dropDown = document.createElement('span');
      dropDown.classList.add('tool__dropdown');
      dropDown.innerHTML = plus + minus;

      return dropDown;
    })();

    this.trigger = (() => {
      const trigger = document.createElement('div');
      trigger.classList.add('tool__trigger');
     
      const triggerInfo = document.createElement('div');
      triggerInfo.classList.add('tool__info');

      triggerInfo.append(this.icon.container);
      triggerInfo.append(this.label.title);

      trigger.append(triggerInfo);

      trigger.append(this.dropdownIcon);

      trigger.addEventListener('click', this.toggle.bind(this));

      return trigger;
    })();

    this.container.append(this.trigger);

    this.collapsible = (() => {
      const collapsible = document.createElement('div');
      collapsible.classList.add('tool__collapsible');

      const collapsibleInner = document.createElement('div');
      collapsibleInner.classList.add('tool__collapsible-inner');

      collapsible.append(collapsibleInner);

      this.container.append(collapsible);

      return {
        container: collapsible,
        inner: collapsibleInner
      }
    })();

    this.setContent();
  }
  
  open() {
    this.collapsible.container.style.height = this.collapsible.container.scrollHeight + 'px';

    clearTimeout(this.timer.in);
    clearTimeout(this.timer.out);
    
    this.timer.in = setTimeout(() => {
      this.collapsible.container.style.height = 'auto';
    }, 500);

    this.container.toggleAttribute('data-open');
  }

  close() {
    this.collapsible.container.style.height = this.collapsible.container.scrollHeight + 'px';

    clearTimeout(this.timer.in);
    clearTimeout(this.timer.out);

    this.timer.out = setTimeout(() => {
      this.collapsible.container.style.height = null;
      this.container.removeAttribute('data-open');
    }, 10);
  }

  toggle() {
    if (this.container.hasAttribute('data-open')) {
      this.close();
    } else {
      this.open();
    }
  }

  setContent() {
    const content = document.createElement('div');

    content.textContent = 'Content';

    this.collapsible.inner.append(content);
  }

  initLabel(label) {
    const title = document.createElement('span');
    title.classList.add('tool__title');

    title.textContent = label;

    return {
      title,
      setLabel: (label) => { 
        title.textContent = label;

        this.container.setAttribute('data-tool', label);
      }
    };
  }

  setOnCreate(state) {
    if (!state) {
      return;
    }

    this.setValue(state);
  }

  setValue(value) {
    return value;
  }

  getValue() {
    return {
      value: 'Content'
    }
  }

  isExists() {
    return document.contains(this.container);
  }

  create(state) {
    this._defaultCreate(state);
  }

  _defaultCreate(state) {
    this.container.style.opacity = 0;
    this.editList.append(this.container);     
    
    setTimeout(() => {
      this.container.style.opacity = null;
      this.setOnCreate(state);
    }, 300);
  }

  remove() {
    this.container.style.opacity = 0;

    setTimeout(() => {
      this.container.style.opacity = null;
      this.container.remove();
    }, 300);
  }

  exists() {
    return document.contains(this.container);
  }

  reset() {
    this.close();
    this.setValue('Content');
  }
}

export default Tool;