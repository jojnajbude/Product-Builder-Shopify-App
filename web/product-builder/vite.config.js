export default {
  mode: 'development',
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    assetsInclude: ['assets/*', '**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif', '**/*.ico'],
    lib: {
      entry: './main.js',
      name: 'main',
      fileName: 'main.js',
      formats: ['es'],
    },
    watch: {
      include: './**',
    }
  },
};