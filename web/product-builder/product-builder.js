class ImageCropper {
  constructor(mockup) {
    this.container = document.createElement('div');
    this.container.id = mockup.getId();
    this.container.className = 'image-cropper';

    this.cropButton = document.querySelector('[data-tool-crop]');
    this.cropButton.addEventListener('click', this.openCropPopup.bind(this));

    document.body.append(this.container);
  }

  openCropPopup() {
    this.container.classList.add('is-open');
  }

  closeCropPopup() {
    this.container.classList.remove('is-open');
  }
}

class ProductMockup {
  constructor(container, imageUrl) {
    this.container = container;

    this.filters = Object.keys(Caman.prototype).slice(75, 93);

    this.image = new Image();
    this.fileName = 'https://picsum.photos/600';

    this.image.src = this.fileName;
    this.image.setAttribute('Crossorigin', '');

    this.canvas = this.container.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.style.opacity = 0;

    this.canvasId = `#${this.canvas.id}`;

    this.options = {};

    this.image.onload = this.imageOnload.bind(this);

    this.imageCropper = new ImageCropper(this);
  }

  getId() {
    return +this.canvas.dataset.id;
  }

  imageOnload() {
    this.container.style.width = `${this.image.width / 2}px`;
    this.container.style.height = `${this.image.height / 2}px`;

    this.canvas.setAttribute('width', this.image.width);
    this.canvas.setAttribute('height', this.image.height);

    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.widthPadding = 0;
    this.heightPadding = 0;

    this.canvas.style.opacity = 1;
  }

  changeMat(option) {
    this.ctx.reset();
    this.options.mat = option;

    const scale = {
      'none': 1,
      'shallow': 0.8,
      'medium': 0.6,
      'deep': 0.4
    };

    this.width = this.canvas.width * scale[option.toLowerCase()];
    this.height = this.canvas.height * scale[option.toLowerCase()];
    this.widthPadding = (this.canvas.width - this.width) / 2;
    this.heightPadding = (this.canvas.height - this.height) / 2;

    this.ctx.drawImage(this.image, this.widthPadding, this.heightPadding, this.width, this.height);

    this.changeEffect(this.options.effect);
  }

  changeFrame(option) {
    this.options.frame = option;

    switch (option) {
      case 'black':
        this.container.style.border = '10px solid #000';
        break;
      case 'white':
        this.container.style.border = '10px solid #fff';
        break;
      case 'frameless':
        this.container.style.border = '0px solid transparent';
        break;
    }
  }

  changeEffect(option) {
    if (!option) {
      return;
    }

    this.options.effect = option;

    switch (option) {
      case 'original':
        Caman(this.canvasId, function() {
          this.revert(false);

          this.render();
        })
        break;
      case 'silver':
        Caman(this.canvasId, function() {
          this.revert(false);
          this.sinCity().render();
        });
        break;
      case 'noir':
        Caman(this.canvasId, function() {
          this.revert(false);
          this.hemingway().render();
        });
        break;
      case 'vivid':
        Caman(this.canvasId, function() {
          this.revert(false);
          this.nostalgia().render();
        });
        break;
      case 'dramatic':
        Caman(this.canvasId, function() {
          this.revert(false);
          this.love().render();
        });
        break;
    }
  }
}

class BuilderTool {
  constructor(container) {
    this.container = container;

    this.isOpen = this.container.dataset.isOpen === 'true' ? true : false;

    this.closeButton = this.container.querySelector(`[data-toggler]`);

    this.options = [...this.container.querySelectorAll('[data-tool-option]')];

    this.options.forEach(option => {
      option.addEventListener('click', this.selectOption.bind(this, option));
    })

    this.selectedOption = this.options
      .find(option => option.classList.contains('is-selected'))
      ?? this.options[0];

    if (this.selectedOption && !this.selectedOption.classList.contains('is-selected')) {
      this.selectedOption.classList.add('is-selected');
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.close.bind(this));
    }

    if (this.isOpen) {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.container.classList.add('is-open');
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('is-open');
  }

  tool() {
    return this.container.dataset.tool;
  }

  optionsValue() {
    return this.options.map(option => option.dataset.toolOption);
  }

  selectOption(option) {
    option.classList.add('is-selected');

    this.options.filter(unselected => unselected !== option)
      .forEach(unselected => unselected.classList.remove('is-selected'));

    this.selectedOption = option;

    document.dispatchEvent(new CustomEvent('product-builder:option-changed', {
      detail: {
        tool: this.tool.apply(this),
        option: this.selectedOption.dataset.toolOption
      }
    }))
  }

  selected() {
    return this.selectedOption.dataset.toolOption;
  }
}

class ProductBuilder extends HTMLElement {
  static MockupHTML = (id) => {
    const newMockup = document.createElement('div');
    newMockup.className = 'product-builder__item product-mockup';
    newMockup.dataset.builderMockup = '';

    const newCanvas = document.createElement('canvas');
    newCanvas.id = `mockup-${id}`;
    newCanvas.dataset.id = id;

    newMockup.append(newCanvas);

    return newMockup
  };

  constructor() {
    super();

    this.builderToolsContainer = document.querySelector('[data-builder-tools');

    this.viewport = this.querySelector('[data-builder-viewport]');

    this.mockups = [...this.querySelectorAll('[data-builder-mockup]')]
      .map(mockup => {
        return new ProductMockup(mockup);
      });

    this.mockups.forEach(mockup => {
      mockup.container.addEventListener('click', this.selectFocusedMockups.bind(this, mockup));
    });

    this.focusedMockups = this.mockups;

    this.tools = [...document.querySelectorAll('[data-tool]')]
      .map(mockup => {
        const tool = new BuilderTool(mockup);

        const openButton = document.querySelector(`[data-toggler="${tool.tool()}"]`);
        openButton.addEventListener('click', () => {
          tool.open();

          this.tools.filter(toClose => toClose != tool)
            .forEach(toClose => toClose.close());
        })

        return tool;
      });

    this.currentOptions = this.tools.reduce((obj, curr) => {
      obj[curr.tool()] = curr.selected();

      return obj;
    }, {});

    this.addMockupButton = this.querySelector('[data-product-builder-add-button]');
    this.addMockupButton.addEventListener('click', this.addMockup.bind(this));

    document.addEventListener('product-builder:option-changed', (event) => {
      const { tool, option } = event.detail;
      this.currentOptions[tool] = option;

      switch (tool) {
        case 'mat':
          this.focusedMockups.forEach(mockup => mockup.changeMat(this.currentOptions[tool]));
          break;
        case 'frame':
          this.focusedMockups.forEach(mockup => mockup.changeFrame(this.currentOptions[tool]));
          break;
        case 'effect':
          this.focusedMockups.forEach(mockup => mockup.changeEffect(this.currentOptions[tool]));
          break;
      }
    });

    this.unfocusButton = this.querySelector('[data-unfocus-button]');
    this.unfocusButton.addEventListener('click', this.unfocus.bind(this));
  }

  unfocus() {
    if (this.tools.some(tool => tool.isOpen)) {
      this.tools.forEach(tool => {
        tool.close();
      })
    } else {
      this.classList.remove('is-focused');
      this.builderToolsContainer.classList.remove('is-fixed');
  
      this.focusedMockups.forEach(mockup => {
        mockup.container.classList.remove('is-focused');
      })
  
      this.focusedMockups = this.mockups;
      this.closeCropButton.apply(this);
    }
  }

  addMockup() {
    const newId = Math.max(...this.mockups.map(mockup => mockup.getId())) + 1;
    const newMockupHTML = ProductBuilder.MockupHTML(newId);

    this.viewport.append(newMockupHTML);

    const newMockup = new ProductMockup(newMockupHTML);

    this.mockups.push(newMockup);
    newMockup.container.addEventListener('click', this.selectFocusedMockups.bind(this, newMockup));
  }

  openCropButton() {
    const cropButton = this.builderToolsContainer.querySelector('[data-tool-crop]');
    cropButton.classList.remove('hidden');
  }

  closeCropButton() {
    const cropButton = this.builderToolsContainer.querySelector('[data-tool-crop]');
    cropButton.classList.add('hidden');
  }

  selectFocusedMockups(targetMockup) {
    this.focusedMockups = this.mockups.filter(mockup => {
      return mockup === targetMockup;
    });

    this.focusedMockups.forEach(mockup => {
      mockup.container.classList.add('is-focused');
      
      this.tools.forEach(tool => {
        const option = tool.options
          .find(finded => finded.dataset.toolOption === mockup.options[tool.tool()])
            ?? tool.options[0];

        tool.selectOption(option);
      })
    });

    this.classList.add('is-focused');
    this.builderToolsContainer.classList.add('is-fixed');
    this.openCropButton.apply(this);
  }
}

customElements.define('product-builder', ProductBuilder);
