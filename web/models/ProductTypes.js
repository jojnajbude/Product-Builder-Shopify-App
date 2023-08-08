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
  },
  variants: {
    '20/20 cm': '20-20'
  }
};

const Puzzle = {
  id: 'puzzle',
  title: 'Puzzle',
  variants: {
    '96 Pieces': '96',
    '192 Pieces': '192',
    '513 Pieces': '513'
  },
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
  },
  variants: {
    '9/13 cm': '9-13',
    '10/15 cm': '10-15',
    '15/21 cm': '15-21',
    '20/30 cm': '20-30',
    '30/40 cm': '30-40',
    'Photostrip': 'photostrip',
    'Polaroid': 'polaroid'
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
  },
  variants: {
    'Square': 'square',
    'Heart': 'heart',
    'Circle': 'circle'
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
  },
  variants: {
    '10/15 cm': '10-15',
    'polaroid': 'polaroid'
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
  },
  variants: {
    '30/40 cm': '30-40',
    '30/30 cm': '30-30',
    '40/40 cm': '40-40'
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
  },
  variants: {
    'Layflat 20/20 cm': 'layflat-20-20',
    'Layflat 25/25 cm': 'layflat-25-25',
    'Glossy 15/15 cm': 'glossy-15-15',
    'Glossy 20/20 cm': 'glossy-20-20'
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
  },
  variants: {
    '20/30 cm': '20-30-250',
    '20-30 cm': '20-30-500'
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