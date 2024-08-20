import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers'
import jwt from 'jsonwebtoken'
import { env } from 'interfaces/env'

function extractTokenFromRequest(request: any) {
  const token = request.headers.authorization

  if (!token) {
    return null
  }

  if (token.startsWith('Bearer ')) {
    // remove Bearer from token
    return token.slice(7, token.length)
  }

  return token
}

@Middleware({ type: 'before' })
export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err: any) => any): void {
    const token = extractTokenFromRequest(request)

    if (!token) {
      // no token to decode
      return next(null)
    }

    jwt.verify(token, env.app.secret, { audience: 'app' }, (err: any, decoded: any) => {
      if (err) {
        if (!env.app.secondarySecret) {
          return next(err)
        }

        // Reattempt verification with different secret
        jwt.verify(
          token,
          env.app.secondarySecret,
          { audience: 'app' },
          (errSecond: any, decodedSecond: any) => {
            if (errSecond) {
              return next(errSecond)
            }

            request.authToken = decodedSecond
            next(null)
            return
          },
        )
        return
      }

      request.authToken = decoded
      next(null)
    })
  }
}
