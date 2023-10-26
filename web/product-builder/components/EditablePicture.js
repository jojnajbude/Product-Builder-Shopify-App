class EditablePicture extends HTMLElement {
  static hovered = [];

  static emptyPixel = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

  static emptyState = (bigSize) => {
    const empty = document.createElement('div');
    empty.classList.add('editable-picture__empty-state');

    const icon = `
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.10156 3.98131C1.10156 3.00356 1.89418 2.21094 2.87193 2.21094H13.9367C14.9145 2.21094 15.7071 3.00356 15.7071 3.98131V12.3906C15.7071 13.3683 14.9145 14.1609 13.9367 14.1609H2.87193C1.89418 14.1609 1.10156 13.3683 1.10156 12.3906V3.98131Z" stroke="#FF0079" stroke-width="1.77037" stroke-linejoin="round"/>
        <path d="M4.08594 14.1618L10.9214 6.7567C11.5568 6.06839 12.6184 5.99415 13.3434 6.58732L15.704 8.51875" stroke="#FF0079" stroke-width="1.77037" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.10156 6.85938L6.2467 12.0045" stroke="#FF0079" stroke-width="1.77037"/>
        <path d="M8.73299 8.85104C8.73299 8.18715 7.54405 6.85938 6.07743 6.85938C4.61081 6.85938 3.42188 8.18715 3.42188 8.85104" stroke="#FF0079" stroke-width="1.77037" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    

    empty.innerHTML = icon;

    if (bigSize) {
      empty.classList.add('empty-state--big');

      const text = document.createElement('span');
      text.textContent = window.bodySize === 'desktop'
        ? 'Drag & Drop pictures here'
        : 'Click on the picture to add it here';

      empty.append(text);
    }

    return empty;
  };

  static defaultValue = {
    crop: CropTool.defaultValue,
    rotate: RotateTool.defaultValue,
    backgroundColor: {
      value: BackgroundColorTool.defaultValue.value
    },
    move: {
      x: 0,
      y: 0
    }
  }

  static ToolsList = ['rotate', 'crop', 'filter', 'move'];

  static selectors = {
    emptyState: '[data-empty-state]'
  }

  static get observedAttributes() {
    return ['picture-type'];
  }

  constructor() {
    super();

    this.addEventListener('mouseover', () => {
      EditablePicture.hovered.push(this);
    });

    this.addEventListener('mouseleave', () => {
      EditablePicture.hovered = EditablePicture.hovered.filter(item => item !== this);
    });

    this.addEventListener('touchstart', () => {
      EditablePicture.hovered.push(this);
    });

    this.addEventListener('touchend', () => {
      EditablePicture.hovered = EditablePicture.hovered.filter(item => item !== this);
    })

    this.addEventListener('dragenter', () => {
      this.classList.add('is-dragover');
    }, true);

    this.addEventListener('dragleave', (event) => {
        this.classList.remove('is-dragover');
    });

    this.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    this.addEventListener('drop', (event) => {
      event.preventDefault();
      this.classList.remove('is-dragover');

      const source = event.dataTransfer.getData('text');

      if (source) {
        const data = [
          {
            pictureIds: [this.getAttribute('child-block')],
            imageUrl: source
          }
        ];

        Studio.utils.change({ imagesToDownload: data }, 'dragged');
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'picture-layout':
        this.prevType = oldValue;
        break;
    }
  }

  connectedCallback() {
    this.toggleAttribute('editable-picture');

    if (!this.getAttribute('child-block')) {
      this.setAttribute('child-block', uniqueID.childBlock());
    }

    this.controls = ProductControls.createPictureControls(this.getAttribute('child-block'));
    
    this.parentBlock = Array.from(document.querySelectorAll('[block]')).find(block => {
      const child = Array.from(block.querySelectorAll('[child-block]')).find(cBlock => cBlock.getAttribute('child-block') === this.getAttribute('child-block'));

      return child;
    });

    const { width: resolutionWidth, height: resolutionHeight } = Studio.product.resolution; 

    this.pageConfig = getResolution(resolutionWidth, resolutionHeight);

    this.emptyState = EditablePicture.emptyState(this.offsetWidth > 300);

    this.append(this.emptyState);

    if (this.emptyState) {
      this.emptyState.addEventListener('click', () => {
        Studio.panel.tools.focusOnTab('images');
      })
    }

    if (!this.hasAttribute('crop')) {
      this.setAttribute('crop', 0);
    }

    if (!this.hasAttribute('rotate')) {
      this.setAttribute('rotate', 0);
    }

    if (!this.hasAttribute('background-color')) {
      this.setAttribute('background-color', BackgroundColorTool.defaultValue.value);
    }

    if (this.hasAttribute('picture-url')) {
      this.setImage(this.getAttribute('picture-url'));
      this.toggleAttribute('picture-url');
    }

    this.addEventListener('click', (event) => {
      const isControlsTarget = event.target === this.controls || this.controls.contains(event.target)

      Studio.studioView.setSelectedChild(this, event.shiftKey);

      if (!this.classList.contains('is-empty') && event.target !== this.emptyState && !this.emptyState.contains(event.target) && !isControlsTarget) {
        Studio.panel.tools.focusOnTab('edit');
      }

      if (this.classList.contains('is-empty')) {
        Studio.panel.tools.focusOnTab('images');
      }
    })
  }

  select() {
    this.classList.add('is-selected');

    if (!this.classList.contains('is-empty') && Studio.product.type.id === 'photobook') {
      this.appendControls();
    }
  }

  appendControls() {
    this.controls.style.opacity = 0;

    this.append(this.controls);
    setTimeout(() => {
      this.controls.style.opacity = null;
    }, 10);
  }

  unselect() {
    this.classList.remove('is-selected');

    if (document.contains(this.controls)) {
      this.controls.remove();
    }
  }

  getToolsList() {
    return ['rotate', 'crop', 'filter'];
  }

  createMask(type) {
    if (!type) {
      return;
    }

    const mask = document.createElement('div');

    mask.classList.add('editable-picture__mask');

    const setMask = (maskType) => {
      const layout = layouts[maskType];

      if (!layout || !layout.mask) {
        mask.innerHTML = '';
        return;
      }

      mask.innerHTML = layout.mask;
    }

    mask.set = setMask;

    return mask;
  }

  initMove() {
    if (this.move) {
      this.removeEventListener('mousedown', this.move.mouseDown);
      window.removeEventListener('mouseup', this.move.mouseUp);
      this.removeEventListener('mousemove', this.move.onMove);

      this.removeEventListener('touchstart', this.move.mouseDown);
      window.removeEventListener('touchend', this.move.mouseUp);
      this.removeEventListener('touchmove', this.move.onMove);
    }

    this.xPosition = 0;
    this.yPosition = 0;

    this.resetMove = () => {
      this.xPosition = 0;
      this.yPosition = 0;

      this.move.x = 0;
      this.move.y = 0;

      this.mover.style.transform = `translate .3s`;

      this.mover.style.translate = `0% 0%`;

      setTimeout(() => {
        this.mover.style.translate = null;
        this.mover.style.transform = null;
      }, 300);
    }

    function onMove(event) {
      const diffX = event.touches
        ? event.touches[0].clientX - this.move.prevX
        : event.clientX - this.move.prevX;

      const diffY = event.touches
        ? event.touches[0].clientY - this.move.prevY
        : event.clientY - this.move.prevY;

      if (diffX > 0) {
        this.xPosition = Math.min(
            ((this.xPosition * -1) - diffX) * -1,
            this.move.paddings.x.min * -1
        );
      } else if (diffX < 0) {
        this.xPosition = Math.max(
            ((this.xPosition * -1) - diffX) * -1,
            this.move.paddings.x.max * -1
        )
      }

      if (diffY > 0) {
        this.yPosition = Math.min(
            ((this.yPosition * -1) - diffY) * -1,
            this.move.paddings.y.min * -1
        )
      } else if (diffY < 0) {
        this.yPosition = Math.max(
            ((this.yPosition * -1) - diffY) * -1,
            this.move.paddings.y.max * -1
        )
      }

      if (this.offsetHeight > this.move.preview.height) {
        this.yPosition = 0;
      }

      if (this.offsetWidth > this.move.preview.width) {
        this.xPosition = 0;
      }

      const persentX= (this.xPosition * 100 / this.move.frame.width);
      const persentY= (this.yPosition * 100 / this.move.frame.height);

      const rotateValue = Number(this.getAttribute('rotate'));

      this.move.x = this.xPosition > 0
        ? Number(((this.xPosition * -100) / this.move.paddings.x.max).toFixed(2))
        : Number(((this.xPosition * 100) / this.move.paddings.x.min).toFixed(2));

      this.move.y = this.yPosition > 0
        ? Number(((this.yPosition * -100) / this.move.paddings.y.max).toFixed(2))
        : Number(((this.yPosition * 100) / this.move.paddings.y.min).toFixed(2));

      this.mover.style.translate = `${persentX}% ${persentY}%`;

      this.move.prevX = event.touches
        ? event.touches[0].clientX
        : event.clientX;
      this.move.prevY = event.touches
        ? event.touches[0].clientY
        : event.clientY;
    }

    this.move = {
      prevX: null,
      prevY: null,
      onMove: onMove.bind(this),
    };

    this.move.mouseDown = ((event) => {
      this.move.prevX = event.touches
        ? event.touches[0].clientX
        : event.clientX;
      this.move.prevY = event.touches
        ? event.touches[0].clientY
        : event.clientY;

      if (event.touches) {
        Studio.studioView.elements.playground.style.overflow = 'hidden';
      }

      if (event.touches) {
        this.addEventListener('touchmove', this.move.onMove);
      } else {
        this.addEventListener('mousemove', this.move.onMove);
      }
    }).bind(this);

    this.move.mouseUp = (() => {
      this.removeEventListener('mousemove', this.move.onMove);
      this.removeEventListener('touchmove', this.move.onMove);

      Studio.studioView.elements.playground.style.overflow = null;

      const newBlocks = Studio.state.view.blocks.map(block => {
        const childBlock = block.childBlocks.find(child => child.id === this.getAttribute('child-block'));

        if (childBlock) {
          const newChildBlocks = block.childBlocks.map(child => {
            if (child.id === this.getAttribute('child-block')) {
              const { settings } = { ...child };

              if (this.move.x) {
                settings.move.x = this.move.x;
              }

              if (this.move.y) {
                settings.move.y = this.move.y;
              }

              return {
                ...child,
                settings
              }
            }

            return child;
          });

          return {
            ...block,
            childBlocks: newChildBlocks
          }
        }

        return block;
      });

      Studio.utils.change({
            view: { ...Studio.state.view, blocks: newBlocks }
      }, 'move - id:' + this.getAttribute('child-block'));
    }).bind(this);

    this.setMoveParams = () => {
      this.move.preview = this.previewImage.getBoundingClientRect();
      this.move.mover = this.mover.getBoundingClientRect();
      this.move.frame = this.getBoundingClientRect();

      this.move.paddings = {
        x: {
          min: this.move.mover.left - this.move.frame.left,
          max: this.move.mover.right - this.move.frame.right
        },
        y: {
          min: this.move.mover.top - this.move.frame.top,
          max: this.move.mover.bottom - this.move.frame.bottom
        }
      }
    }

    this.setMoveParams();

    this.addEventListener('mousedown', this.move.mouseDown);
    this.addEventListener('touchstart', this.move.mouseDown);

    window.addEventListener('mouseup', this.move.mouseUp);
    window.addEventListener('touchend', this.move.mouseUp);

    if (this.previewImage) {
      const child = Studio.state.view.blocks
        .reduce((children, block) => [...children, ...block.childBlocks], [])
        .find(child => child.id === this.getAttribute('child-block'));


      if (child) {
        const { x, y } = child.settings.move;

        if (typeof x === 'number' && typeof y === 'number') {
          const xPosition = x > 0
            ? Number((this.move.paddings.x.min * x / 100).toFixed(2))
            : Number((this.move.paddings.x.max * x / -100).toFixed(2));

          const yPosition = y > 0
            ? Number((this.move.paddings.y.min * y / 100).toFixed(2))
            : Number((this.move.paddings.y.max * y / -100).toFixed(2));

          const xPercent = Number((xPosition * 100 / this.move.frame.width).toFixed(2));
          const yPercent = Number((yPosition * 100 / this.move.frame.height).toFixed(2));

            this.mover.style.translate = `${xPercent}% ${yPercent}%`;

            this.xPosition = this.move.frame.width * xPercent / 100;
            this.yPosition = this.move.frame.height * yPercent / 100;
        }
      }
    }
  }

  setImage(imageUrl) {
    if (!Studio.product) {
      return;
    }

    this.mover && this.mover.remove();

    this.mover = document.createElement('div');
    this.mover.classList.add('editable-picture__mover');

    if (this.image) {
      this.oldImage = this.image;
      this.oldImage.remove();
    }

    if (this.previewImage) {
      this.oldPreviewImage = this.previewImage;
      this.oldPreviewImage.remove();
    }

    this.defaultImageUrl = imageUrl;

    this.previewImage = new Image();
    // this.previewImage.toggleAttribute('crossOrigin');
    this.previewImage.classList.add('editable-picture__image', 'editable-picture__preview-image');
    // this.previewImage.style.opacity = 0;
    this.previewImage.draggable = false;

    const findedImage = Studio.uploaded
      .find(image => Object.values(image)
        .some(source => imageUrl.includes(source))
      );
    
    if (!findedImage) {
      return;
    }

    const imageOriginalURL = findedImage.original;

    this.image = new Image();
    this.image.classList.add('editable-picture__image');
    this.image.style.opacity = 0;
    this.image.draggable = false;
    this.image.toggleAttribute('crossOrigin');
    
    this.image.onload = () => {
      this.image.style.opacity = null;
    }

    this.classList.add('is-loading');

    Promise.all([
      // new Promise(res => this.image.addEventListener('load', () => res())),
      new Promise(res => this.previewImage.addEventListener('load', res())),
    ]).then(async _ => {

      const currChild = Studio.state.view.blocks
        .reduce((children, block) => [...children, ...block.childBlocks], [])
        .find(child => child.id === this.getAttribute('child-block'));

      if (Studio.state.product.type.id === 'tiles' && (currChild && currChild.settings.crop.value === 0 && !currChild.fitted || this.oldImage)) {
        await this.fillImage(this.defaultImageUrl);

        this.classList.remove('is-loading');
      } else {
        this.classList.remove('is-loading');
      }

      this.initMove();
    });

    const getParams = () => {
      const size = this.pageConfig;

      if (this.parentBlock.hasAttribute('layout')) {

        const widthProcent = Math.round(((this.offsetWidth * 100) / this.parentBlock.offsetWidth))
        const heightProcent = Math.round((this.offsetHeight * 100) / this.parentBlock.offsetHeight);
  
        const width = Math.ceil(size.width / 100 * widthProcent);
        const height = Math.ceil(size.height / 100 * heightProcent);
  
        return [width, height];
      }

      return [this.pageConfig.width, this.pageConfig.height];
    };


    const [width, height] = this.pageConfig ? getParams() : [this.offsetWidth, this.offsetHeight];
    const [containerWidth, containerHeight] = [Math.ceil(this.offsetWidth * 4 * 2), Math.ceil(this.offsetHeight * 4 * 2)];

    this.defaultImageUrl = imageOriginalURL + `?width=${containerWidth}`;

    this.previewImage.onload = () => {

      if (this.previewImage.naturalWidth < containerWidth) {
        this.previewImage.style.width = (this.previewImage.naturalWidth * this.offsetWidth / containerWidth) + 'px';
      }
    }

    this.previewImage.src = this.defaultImageUrl;

    // this.image.src = this.defaultImageUrl;

    this.classList.remove('is-empty');

    this.mask = this.createMask(this.getAttribute('picture-type'));

    this.append(this.mover);

    if (this.mask) {
      this.mover.append(
        this.previewImage,
        // this.image
      );

      this.append(this.mask);
    } else {
      this.mover.append(
        this.previewImage,
        // this.image
      );
    }
  }

  fillImage(imageUrl) {
    return new Promise(async (res, rej) => {
      const url = new URL(imageUrl);

      const image = new Image();
      
      const [ naturalWidth, naturalHeight] = await new Promise(res => {
        image.onload = () => {
          res([image.naturalWidth, image.naturalHeight]);
        }

        image.src = url.origin + url.pathname;
      });

      const minSide = Math.min(naturalWidth, naturalHeight);

      const requiredSide = Tiles.printSizes[this.getAttribute('picture-type')];

      let multiply;

      if (minSide <= requiredSide) {
        multiply = 100 - (minSide * 100) / requiredSide
      } else {
        multiply = 100 - (requiredSide * 100) / minSide;
      }

      const newBlocks = Studio.state.view.blocks.map(block => {
        const newChildren = block.childBlocks
          .map(child => {
            if (child.id === this.getAttribute('child-block')) {

              child.settings.crop = {
                value: +(multiply.toFixed(0))
              }

              return {
                ...child,
                fitted: true
              };
            }

            return child;
          });

        return {
          ...block,
          childBlocks: newChildren
        }
      });

      Studio.utils.change({ view: {
        ...Studio.state.view,
        blocks: newBlocks
      }}, 'fit image - set image');

      res();
    });
  }

  setBackground(background) {
    this.setAttribute('background-color', background);
  }

  setType(type) {
    this.setAttribute('picture-type', type);

    if (!this.image) {
      return;
    }

    const onLoad = () => {
      this.classList.remove('is-loading');

      this.image.removeEventListener('load', onLoad);
    }

    this.image.addEventListener('load', onLoad);


    if (this.mask) {
      this.mask.set(this.getAttribute('picture-type'));
    }
  }

  removeImage() {
    this.image.remove();
    // this.image.removeAttribute('src');
    this.previewImage.remove();
    // this.previewImage.removeAttribute('src');

    this.mask && this.mask.remove();

    this.classList.add('is-empty');
  }

  destroy() {
    this.remove();
  }

  hasImage() {
    return this.previewImage && this.previewImage.hasAttribute('src') && this.previewImage.src !== EditablePicture.emptyPixel;
  }

  setValue(settings) {
    clearTimeout(this.timer);

    const [
      prevCrop,
      prevRotate,
      prevBackground,
      prevSource
     ] = [
      +this.getAttribute('crop'),
      +this.getAttribute('rotate'),
      this.getAttribute('background-color'),
      this.image ? this.image.src : null
     ];

     const { crop, rotate, backgroundColor, move } = settings;

     const notTransparent = prevCrop === crop.value
      && prevRotate === rotate.value
      && prevBackground === backgroundColor.value
      && this.image
      && prevSource === this.image.src
      && this.image.complete
      && this.prevType === this.getAttribute('picture-type');

     const rotatePreview = () => {
       if (!this.previewImage) {
         return 1;
       }
       const diagonal = Math.sqrt(Math.pow(this.previewImage.offsetWidth, 2) + Math.pow(this.previewImage.offsetHeight, 2));

       const calculateAngle = () => {
         const { value: rotateValue } = rotate;

         if (rotateValue < 90) {
           return rotateValue;
         } else if (rotateValue >= 90 && rotateValue < 180) {
           return rotateValue - 90;
         } else if (rotateValue >= 180 && rotateValue < 270) {
            return rotateValue - 180;
         } else if (rotateValue >= 270 && rotateValue < 360) {
           return rotateValue - 270;
         }

         return rotateValue;
       }

       const newAngle = Math.atan(this.previewImage.offsetHeight / this.previewImage.offsetWidth) * 180 / Math.PI;

       const newAngle2 = Math.abs(newAngle - calculateAngle());

       const { offsetWidth, offsetHeight } = this.previewImage;

       const newWidth = Math.abs(Math.cos(newAngle2 * Math.PI / 180) * diagonal);

       const returnedValue = Number((offsetWidth / newWidth).toFixed(2));

       return returnedValue;
     }

    // const toChange = this.classList.contains('is-selected')
    //   || (
    //     !compareObjects(this.crop, crop)
    //       || !compareObjects(this.rotate, rotate)
    //   ) || !compareObjects(this.previousBackground, backgroundColor)
    //   || this.prevType === this.getAttribute('picture-type');

    const toChange = true;

    this.crop = crop;
    this.rotate = rotate;

    if (crop) {
      this.setAttribute('crop', crop.value);
    }

    if (rotate) {
      this.setAttribute('rotate', rotate.value);
    }

    if (backgroundColor) {
      this.setAttribute('background-color', backgroundColor.value);
    }

    if (!this.previewImage || !this.previewImage.src) {
      return;
    }

    if (prevCrop !== crop.value || prevRotate !== rotate.value) {
      this.cropTimeout && clearTimeout(this.cropTimeout);

      this.resetMove && this.resetMove();

      this.cropTimeout = setTimeout(() => {
        this.setMoveParams && this.setMoveParams();
      }, 100);
    }

    const imageUrl = new URL(this.previewImage.src);
    const previewImageUrl = new URL(this.previewImage.src);

    if (crop && rotate && toChange) {
      // this.image.style.opacity = notTransparent ? 1 : 0;
      // this.previewImage.style.opacity = null;

      this.mover.style.rotate = `${rotate.value}deg`;
      this.mover.style.scale = (rotatePreview() * 1 + (crop.value / 50));
    }

    if (backgroundColor && this.image) {
      this.previousBackground = backgroundColor;

      previewImageUrl.searchParams.set('background', backgroundColor.value);

      this.style.backgroundColor = backgroundColor.value;

      // this.previewImage.src = previewImageUrl.href;
    }

    if (this.image && rotate && toChange || (this.image && backgroundColor)) {
      this.image.onload = () => {
        if (this.timer) {
          return;
        }

        this.image.style.opacity = 1;
        // this.previewImage.style.opacity = 0;
      }

      this.timer = setTimeout(() => {
        const cropValue = (1 + (Math.round((crop.value / 50) * 100) / 100)).toFixed(2);

        imageUrl.searchParams.set('rotate', rotate.value);
        imageUrl.searchParams.set('crop', cropValue);
        imageUrl.searchParams.set('background', backgroundColor.value);
        imageUrl.searchParams.set('x', move.x);
        imageUrl.searchParams.set('y', move.y);

        imageUrl.searchParams.set('type', this.getAttribute('picture-type'));

        if (this.mask) {
          this.mask.set(this.getAttribute('picture-type'));
        }

        // this.image.src = imageUrl.href;
        this.timer = null;
      }, 600);
    }
  }

  getValue() {
    return {
      crop: {
        value: +this.getAttribute('crop') 
      },
      rotate: {
        value: +this.getAttribute('rotate')
      },
      backgroundColor: { 
        value: this.getAttribute('background-color')
      }
    }
  }
}
customElements.define('editable-picture', EditablePicture);

export default EditablePicture;