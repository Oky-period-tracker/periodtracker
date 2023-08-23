import { OkyUser } from './OkyUser'

export class AuthenticationDescriptor {
  private constructor(private readonly user?: OkyUser, private readonly error?: string) {}

  public static success(user: OkyUser) {
    return new AuthenticationDescriptor(user)
  }

  public static fail(error: string) {
    if (!error) {
      throw new Error(`Provide an error message on authentication failure`)
    }

    return new AuthenticationDescriptor(null, error)
  }

  public fold(onFailure?: (err: string) => any, onSuccess?: (user: OkyUser) => any) {
    if (this.error) {
      return onFailure && onFailure(this.error)
    }

    return onSuccess && onSuccess(this.user)
  }
}
