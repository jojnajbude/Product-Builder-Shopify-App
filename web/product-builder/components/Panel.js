class Panel extends HTMLElement {
  static selectors = {
    productInfo: '[data-product]',
    tools: '[data-customization-tools]',
    mobileTrigger: '[data-mobile-trigger]',
    mobileAdaptiveButtons: 'adaptive-content[panel-related]'
  };

  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();

    this.productInfo = document.querySelector(Panel.selectors.productInfo);
    this.tools = this.querySelector(Panel.selectors.tools);

    this.mobileTriggers = this.querySelectorAll(Panel.selectors.mobileTrigger);

    this.style.translate = `0px 0px`;

    this.event = {
      mobileMouseDown: this.mobileMouseDown.bind(this),
      mouseMove: this.mouseMove.bind(this),
      mobileMouseUp: this.mobileMouseUp.bind(this),
      windowMouseUp: (() => {
        window.removeEventListener('mousemove', this.event.mouseMove);

        this.style.transition = null;
      }).bind(this),
      mobileTouchStart: this.mobileTouchStart.bind(this),
      touchMove: this.touchMove.bind(this),
      mobileTouchEnd: this.mobileTouchEnd.bind(this),
      windowTouchUp: (() => {
        window.removeEventListener('touchmove', this.event.touchMove);

        document.body.style.overscrollBehavior = null;
      }).bind(this),
      prevClientY: null,
      prevTranslateY: 0
    };

    this.mobileTriggers
      .forEach(trigger => {
        trigger.addEventListener('mousedown', this.event.mobileMouseDown);
        trigger.addEventListener('mouseup', this.event.mobileMouseUp);

        trigger.addEventListener('touchstart', this.event.mobileTouchStart);
        trigger.addEventListener('touchend', this.event.mobileTouchEnd);
      });

    window.addEventListener('mouseup', this.event.windowMouseUp);
    window.addEventListener('touchend', this.event.windowTouchUp);

    this.setAttribute('state', JSON.stringify(globalState.panel));

    adaptiveActions.subscribe(this, this.onWindowResize.bind(this));

    this.tools.init();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (compareObjects(prevState, currState)) {
      return;
    }

    if (!compareObjects(prevState.product, currState.product)) {
      this.productInfo.setState({
        product: currState.product
      });

      // this.tools.resetTools();
    }

    if (!compareObjects(prevState.tools, currState.tools)) {
      const toSet = Object.keys(currState.tools)
        .reduce((obj, tool) => {
          obj[tool] = {
            ...currState.tools[tool]
          }

          return obj;
        }, {});

      this.tools.setToolsState(toSet);
    }

      
    if (prevState.blockCount !== currState.blockCount) {
      // this.productInfo.setQuantity(currState.blockCount);

      Studio.utils.change({
        view: {
          ...Studio.state.view,
          blockCount: currState.blockCount
        }
      }, 'panel - blockCount: ' + currState.blockCount)
    }

    this.tools.setImageSelected();
  }

  setState(state) {
    const newState = {
      ...JSON.parse(this.getAttribute('state')),
      ...state
    }

    this.setAttribute('state', JSON.stringify(newState));
  }

  onWindowResize(event) {
    const { size } = event.detail;

    if (size !== 'mobile') {
      this.style.translate = null;
      this.event.prevTranslateY = 0;
    } else {
      document.querySelectorAll(Panel.selectors.mobileAdaptiveButtons)
        .forEach(btn => btn.classList.add('unshow'));

      this.openOnTab(20);
    }

    this.pagesHeight();
  }

  initMobileGradient() {
    const gradient = document.createElement('div');

    gradient.classList.add('gradient', 'customization-panel__mobile-gradient');

    const show = () => {
      gradient.style.opacity = null;
    }

    const unshow = () => {
      gradient.style.opacity = 0;
    }

    const remove = () => gradient.remove();
    const append = () => {
      if (!document.contains(gradient)) {
        this.parentElement.append(gradient);
      }
    }

    
    if (window.bodySize) {
      append();
    } else {
      remove();
    }

    if ((this.event.prevTranslateY * -1) < 90) {
      unshow();
    } else {
      show();
    }

    return {
      gradient,
      show,
      unshow,
      remove,
      append
    };
  }

  openOnTab(percent) {
    if (window.bodySize === 'mobile' && (this.event.prevTranslateY * -1) < this.offsetHeight / 2) {
      this.event.prevTranslateY = (this.offsetHeight * (percent / 100)) * -1;

      this.style.translate = `0px ${this.event.prevTranslateY}px`;

      document.querySelectorAll(Panel.selectors.mobileAdaptiveButtons)
        .forEach(btn => btn.classList.remove('unshow'));
    }

    setTimeout(() => {
      this.pagesHeight();
    }, 300);
  }

  mobileMouseDown(event) {
    this.style.transition = 'translate 0s';

    this.event.prevClientY = event.clientY;

    window.addEventListener('mousemove', this.event.mouseMove);
  }

  mobileTouchStart(event) {
    this.style.transition = 'translate 0s';

    document.body.classList.add('fixed');

    this.event.prevClientY = event.touches[0].clientY;

    window.addEventListener('touchmove', this.event.touchMove); 
  }

  mouseMove(event) {
    const currY = event.clientY;

    const diff = currY - this.event.prevClientY;

    this.event.prevTranslateY = ((this.event.prevTranslateY * -1) - diff) * -1;

    if (this.event.prevTranslateY * -1 < this.offsetHeight * 0.23) {
      document.querySelectorAll(Panel.selectors.mobileAdaptiveButtons)
        .forEach(btn => btn.classList.add('unshow'));
    } else {
      document.querySelectorAll(Panel.selectors.mobileAdaptiveButtons)
        .forEach(btn => btn.classList.remove('unshow'));
    }

    this.pagesHeight();

    if (this.event.prevTranslateY * -1 > (this.offsetHeight - this.offsetHeight * 0.1)) {
      this.style.translate = `0px -${this.offsetWidth}`;
    } else if (this.event.prevTranslateY * -1 < 0) {
      this.style.translate = '0px 0px';
    } else {
      this.style.translate = `0px ${this.event.prevTranslateY}px`;
    }

    this.event.prevClientY = currY;
  }

  touchMove(event) {
    const currY = event.touches[0].clientY;

    const diff = currY - this.event.prevClientY;

    this.event.prevTranslateY = ((this.event.prevTranslateY * -1) - diff) * -1;

    if (this.event.prevTranslateY * -1 < this.offsetHeight * 0.23) {
      document.querySelectorAll(Panel.selectors.mobileAdaptiveButtons)
        .forEach(btn => btn.classList.add('unshow'));
    } else {
      document.querySelectorAll(Panel.selectors.mobileAdaptiveButtons)
        .forEach(btn => btn.classList.remove('unshow'));
    }

    this.pagesHeight();

    if (this.event.prevTranslateY * -1 > (this.offsetHeight - 90)) {
      this.style.translate = `0px -${this.offsetWidth}`;
      this.event.prevClientY = currY;
      return;
    } else if (this.event.prevTranslateY * -1 < 0) {
      this.style.translate = '0px 0px';
      this.event.prevClientY = currY;
      return;
    }

    this.style.translate = `0px ${this.event.prevTranslateY}px`;

    this.event.prevClientY = currY;
  }

  pagesHeight() {
    const selectedPage = this.querySelector(Tools.selectors.pages.page + '.is-selected');

    if (!selectedPage) {
      return;
    }

    if (Studio.classList.contains('desktop')) {
      selectedPage.style.height = null;
      return;
    }

    const clientRect = selectedPage.getBoundingClientRect();
    
    selectedPage.style.height = window.innerHeight - clientRect.y + 'px';
  }

  mobileMouseUp(event) {
    window.removeEventListener('mousemove', this.event.mouseMove);

    this.style.transition = null;
  }

  mobileTouchEnd(event) {
    window.removeEventListener('touchmove', this.event.touchMove);

    document.body.classList.remove('fixed');

    this.style.transition = null;
  }

  onStateChange() {
    const { productInfo, tools } = this.state;

    this.tools.setState(tools);
    this.productInfo.setState(productInfo);
  }

  getImages() {
    return this.tools.getImages();
  }
}
customElements.define('customization-panel', Panel);

export default Panel;