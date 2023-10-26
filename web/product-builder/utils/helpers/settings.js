export const sizes = {
  ...Array
    .from(Array(100), (_, idx) => idx + 1)
    .reduce((obj, item) => {
      obj['Set of ' + item] = item

      return obj;
    }, {}),
  '24 pages': 12,
  '36 pages': 18,
  '48 pages': 24
}

export const globalState = {
  productId: null,
  product: null,
  view: {
    product: null,
    blocks: [],
    blockCount: 0,
    imagesToDownload: null
  },
  panel: {
    product: null,
    blockCount: 0,
    tools: {
      layout: {
        show: true,
      },
      text: {
        show: false
      }
    }
  },
}