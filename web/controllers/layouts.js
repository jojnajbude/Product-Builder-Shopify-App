import sharp from "sharp";

const getImageUrl = (picture, resolution = {}) => {
  if (!picture || !picture.imageUrl) {
    return null;
  }

  const { width = 1000, height = 1000 } = resolution;

  const { crop, rotate, backgroundColor } = picture.settings;

  const cropValue = 1 + (Math.round((crop.value / 50) * 100) / 100);

  const size = `resize=[${width},${height}]&container=[${width},${height}]`;

  const params = `rotate=${rotate.value}&crop=${cropValue}&background=${backgroundColor.value}`;

  return `${picture.imageUrl}?${size}&${params}`;
}

export class PhotobookElement {
  constructor(block) {
    this.blockSettings = block.settings;

    this.block = block;
    this.children = block.childBlocks;

    this.pictures = this.children
      .filter(child => child.type === 'editable-picture');

    this.texts = this.children
      .filter(child => child.type === 'text');

    const { backgroundColor } = this.blockSettings;

    this.layout = sharp({
      create: {
        width: 4724,
        height: 2362,
        channels: 4,
        background: backgroundColor.value,
      }
    });
  }

  setImage() {
    this.pictures.forEach(picture => {
      console.log(getImageUrl(picture));
    });
  }

  async emptyState() {
    return await this.layout.jpeg().toBuffer();
  }

  async draw() {
    const layoutFuncName = this.blockSettings.layout.layout + 'Layout';

    if (!this[layoutFuncName]) {
      return await this.emptyState();
    }

    return await this[layoutFuncName]();
  }

  async wholeLayout() {
    if (!this.pictures.length) { 
      return await this.layout.jpeg().toBuffer();
    }

    let picture = getImageUrl(this.pictures[0], {
      width: 4344,
      height: 1982
    });

    console.log(picture);

    picture = await fetch(picture).then(res => res.arrayBuffer());

    picture = await sharp(Buffer.from(picture)).jpeg().toBuffer();

    this.layout = this.layout
      .composite([
        {
          input: picture,
          top: 190,
          left: 190
        }
      ]);

    this.layout = await this.layout.jpeg().toBuffer();

    return this.layout;
  }
}