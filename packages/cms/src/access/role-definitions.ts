export const userRoles = {
  superAdmin: {
    can: ['createSuperAdmin', 'createAdmin', 'toggleLanguages'],
    inherits: ['admin'],
  },
  admin: {
    can: ['createContentManager'],
    inherits: ['contentManager'],
  },
  contentManager: {
    can: ['writeContent'],
  },
}

export const typeToAction = value => {
  switch (value) {
    case 'superAdmin':
      return 'createSuperAdmin'
    case 'admin':
      return 'createAdmin'
    case 'contentManager':
      return 'createContentManager'
  }
}
