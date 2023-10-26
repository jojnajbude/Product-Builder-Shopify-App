function initIdsHandlers() {
  let blockCounter = 0;

  const getCode = (l) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < l) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const draft = () => {
    let string = '';

    for (let i = 0; i < 20; i++) {
      string += Math.round((Math.random() * 10));
    }

    return string;
  }

  const anonim = () => {
    return Date.now() + '-' + getCode(5);
  }

  const childBlock = () => {
    let childID;

    do {
      childID = 'childBlock-' + blockCounter++;
    } while (document.querySelector(StudioView.selectors.childBlockById(childID)));

    return childID;
  }

  const block = () => {
    let blockID;

    do {
      blockID = 'block-' + blockCounter++;
    } while (document.querySelector(StudioView.selectors.childBlockById(blockID)));

    return blockID;
  }

  return {
    childBlock,
    block,
    draft,
    anonim
  }
};
const uniqueID = initIdsHandlers();

export default uniqueID;