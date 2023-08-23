import { userRoles } from './role-definitions'

class AccessControl {
  constructor(roles: object) {
    this.roles = roles
  }
  private roles: object

  public can = (role, operation) => {
    // Check if role exists
    if (!this.roles[role]) {
      return false
    }
    const $role = this.roles[role]
    // Check if this role has access
    if ($role.can.indexOf(operation) !== -1) {
      return true
    }
    // Check if there are any parents
    if (!$role.inherits || $role.inherits.length < 1) {
      return false
    }

    // Check child roles until one returns true or all return false
    return $role.inherits.some(childRole => this.can(childRole, operation))
  }

  public typeToRole = value => {
    switch (value) {
      case 'superAdmin':
        return 'createAdmin'
      case 'admin':
        return 'createContentManager'
    }
  }
}

export const accessControlList = new AccessControl(userRoles)
