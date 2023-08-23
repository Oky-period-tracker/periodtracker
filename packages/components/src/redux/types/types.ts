/**
 * use this type definition instead of `Function` type constructor
 */
type AnyFunction = (...args: any[]) => any

/**
 * simple alias to save you keystrokes when defining JS typed object maps
 */
interface StringMap<T> {
  [key: string]: T
}

/**
 * action can exists only in 2 shapes. type only or type with payload
 */
export type Action<T extends string = string, P = void> = P extends void
  ? Readonly<{ type: T }>
  : Readonly<{ type: T; payload: P }>

/**
 * get Actions types union from Action creators object.
 * it is recommended to export them under the same name as your Actions object, to leverage token merging
 */
export type ActionsUnion<A extends StringMap<AnyFunction>> = ReturnType<
  A[keyof A]
>

/**
 * gets particular Action type from ActionsUnion
 */
export type ActionsOfType<
  ActionUnion,
  ActionType extends string
> = ActionUnion extends Action<ActionType> ? ActionUnion : never
