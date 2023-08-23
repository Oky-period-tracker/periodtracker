declare module 'console' {
  // disable auto import
  export = typeof import('console')
}
