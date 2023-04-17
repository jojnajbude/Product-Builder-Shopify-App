const Tiles = {
  id: 'tiles',
  title: 'Tiles',
  settings: {
    hasLayout: true,
    selectedLayouts: [],
    hasFrame: true,
    hasText: true,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: false
  }
};

const Puzzle = {
  id: 'puzzle',
  title: 'Puzzle',
  settings: {
    hasLayout: false,
    selectedLayouts: [],
    hasFrame: false,
    hasText: false,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: true
  }
};

const Prints = {
  id: 'prints',
  title: 'Prints',
  settings: {
    hasLayout: false,
    selectedLayouts: [],
    hasFrame: false,
    hasText: true,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: true
  }
};

const Magnets = {
  id: 'magnets',
  title: 'Magnets',
  settings: {
    hasLayout: false,
    selectedLayouts: [],
    hasFrame: false,
    hasText: false,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: false
  }
};

const Boxes = {
  id: 'boxes',
  title: 'Boxes',
  settings: {
    hasLayout: false,
    selectedLayouts: [],
    hasFrame: false,
    hasText: true,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: true
  }
};

const Canvas = {
  id: 'canvas',
  title: 'Canvas',
  settings: {
    hasLayout: false,
    selectedLayouts: [],
    hasFrame: false,
    hasText: false,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: false
  }
};

const Photobook = {
  id: 'photobook',
  title: 'Photobook',
  settings: {
    hasLayout: true,
    selectedLayouts: [],
    hasFrame: false,
    hasText: true,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: true
  }
};

const Stickybook = {
  id: 'stickybook',
  title: 'Stickybook',
  settings: {
    hasLayout: false,
    selectedLayouts: [],
    hasFrame: false,
    hasText: false,
    hasCrop: true,
    hasRotate: true,
    hasFilter: true,
    hasBackground: false
  }
};


export const productTypes = {
  tiles: Tiles,
  puzzle: Puzzle,
  prints: Prints,
  magnets: Magnets,
  boxes: Boxes,
  canvas: Canvas,
  photobook: Photobook,
  stickybook: Stickybook
};