import { SelectQueryBuilder } from 'typeorm'

/**
 * ProvinceFilterService
 * 
 * Centralized service for applying province-based content filtering across all content types.
 * This service ensures consistent filtering logic and handles edge cases.
 * 
 * Logic:
 * - If provinceRestricted = false → Content is global (visible to all users)
 * - If provinceRestricted = true → Check if user's province is in allowedProvinces
 * - If user has no province → Show only global content (provinceRestricted = false)
 */
export class ProvinceFilterService {
  /**
   * Apply province filtering to a TypeORM query builder
   * 
   * @param queryBuilder - TypeORM SelectQueryBuilder instance
   * @param userProvince - The user's province code (e.g., '1', '2', etc.) or null/undefined
   * @param entityAlias - The alias used in the query (e.g., 'article', 'video')
   * @returns The modified query builder with province filtering applied
   */
  static applyProvinceFilter<T>(
    queryBuilder: SelectQueryBuilder<T>,
    userProvince: string | null | undefined,
    entityAlias: string,
  ): SelectQueryBuilder<T> {
    if (!userProvince) {
      // User has no province set - show only global (non-restricted) content
      queryBuilder.andWhere(`${entityAlias}.provinceRestricted = :provinceRestricted`, {
        provinceRestricted: false,
      })
    } else {
      // User has a province - show global content OR content restricted to their province
      queryBuilder.andWhere(
        `(${entityAlias}.provinceRestricted = :provinceRestricted OR ` +
          `(${entityAlias}.provinceRestricted = :provinceRestrictedTrue AND ` +
          `(${entityAlias}.allowedProvinces LIKE :provincePattern OR ` +
          `${entityAlias}.allowedProvinces LIKE :provincePatternStart OR ` +
          `${entityAlias}.allowedProvinces LIKE :provincePatternEnd OR ` +
          `${entityAlias}.allowedProvinces = :provinceExact)))`,
        {
          provinceRestricted: false,
          provinceRestrictedTrue: true,
          // Match province in comma-separated list (handles: "1,2,3", "1", "2,1", "1,2")
          provincePattern: `%,${userProvince},%`,
          provincePatternStart: `${userProvince},%`,
          provincePatternEnd: `%,${userProvince}`,
          provinceExact: userProvince,
        },
      )
    }

    return queryBuilder
  }

  /**
   * Parse allowed provinces string to array
   * 
   * @param allowedProvinces - Comma-separated string of province codes
   * @returns Array of province codes or empty array
   */
  static parseAllowedProvinces(allowedProvinces: string | null | undefined): string[] {
    if (!allowedProvinces) {
      return []
    }
    return allowedProvinces
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
  }

  /**
   * Format provinces array to string for storage
   * 
   * @param provinces - Array of province codes
   * @returns Comma-separated string or null if empty
   */
  static formatAllowedProvinces(provinces: string[] | null | undefined): string | null {
    if (!provinces || provinces.length === 0) {
      return null
    }
    return provinces.join(',')
  }

  /**
   * Validate province codes against available provinces
   * 
   * @param provinces - Array of province codes to validate
   * @param availableProvinces - Array of valid province objects
   * @returns Object with isValid flag and array of invalid codes
   */
  static validateProvinces(
    provinces: string[],
    availableProvinces: Array<{ code: string; name: string }>,
  ): { isValid: boolean; invalidCodes: string[] } {
    const validCodes = new Set(availableProvinces.map((p) => p.code))
    const invalidCodes = provinces.filter((code) => !validCodes.has(code))

    return {
      isValid: invalidCodes.length === 0,
      invalidCodes,
    }
  }

  /**
   * Check if a user can access specific content based on province restrictions
   * 
   * @param provinceRestricted - Whether the content is province-restricted
   * @param allowedProvinces - Comma-separated string of allowed province codes
   * @param userProvince - The user's province code
   * @returns Boolean indicating if user can access the content
   */
  static canUserAccessContent(
    provinceRestricted: boolean,
    allowedProvinces: string | null | undefined,
    userProvince: string | null | undefined,
  ): boolean {
    // Global content (not restricted) - everyone can access
    if (!provinceRestricted) {
      return true
    }

    // Content is restricted but user has no province - cannot access
    if (!userProvince) {
      return false
    }

    // Check if user's province is in allowed list
    const allowed = this.parseAllowedProvinces(allowedProvinces)
    return allowed.includes(userProvince)
  }

  /**
   * Get a human-readable description of province restrictions
   * 
   * @param provinceRestricted - Whether the content is province-restricted
   * @param allowedProvinces - Comma-separated string of allowed province codes
   * @param allProvinces - Array of all available provinces
   * @returns Human-readable string describing the restriction
   */
  static getRestrictionDescription(
    provinceRestricted: boolean,
    allowedProvinces: string | null | undefined,
    allProvinces: Array<{ code: string; name: string }>,
  ): string {
    if (!provinceRestricted) {
      return 'Available to all provinces (Global)'
    }

    const allowed = this.parseAllowedProvinces(allowedProvinces)
    if (allowed.length === 0) {
      return 'No provinces selected (will be treated as global)'
    }

    const provinceNames = allowed
      .map((code) => {
        const province = allProvinces.find((p) => p.code === code)
        return province ? province.name : code
      })
      .join(', ')

    return `Restricted to: ${provinceNames}`
  }
}
