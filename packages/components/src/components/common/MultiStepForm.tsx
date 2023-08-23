import React from 'react'
import { combineReducers, AnyAction, Reducer } from 'redux'

type FormStep = string | number

interface FormState {
  currentStep: FormStep
}

const MultiStepFormContext = React.createContext(undefined)

export const GO_TO_STEP = 'GO_TO_STEP'

export const formActions = {
  goToStep: stepName => ({ type: GO_TO_STEP, stepName }),
}

const formInitialState: FormState = {
  currentStep: 0,
}

function formReducer(state = formInitialState, action): FormState {
  if (action.type === '__INIT__') {
    return {
      currentStep: action.initialStep,
    }
  }

  if (action.formAction && action.formAction.type === GO_TO_STEP) {
    return { ...state, currentStep: action.formAction.stepName }
  }

  return state
}

export function MultiStepForm<S extends object, A extends AnyAction>({
  initialStep,
  appReducer,
  children,
}: {
  initialStep: FormStep
  appReducer: Reducer<S, A>
  children: JSX.Element[]
}) {
  const rootReducer = combineReducers({
    app: appReducer,
    form: formReducer,
  })

  const store = React.useReducer(rootReducer, undefined, () => {
    const initialState = rootReducer(undefined, { type: '__INIT__', initialStep })
    return initialState
  })

  const [formState, formDispatch] = store

  return (
    <MultiStepFormContext.Provider value={store}>
      {React.Children.toArray(children).reduce((elements: any, child: any) => {
        if (child.props.step !== formState.form.currentStep) {
          return elements
        }

        return elements.concat(
          React.cloneElement(child, {
            formState,
            formDispatch,
            ...child.props,
          }),
        )
      }, [])}
    </MultiStepFormContext.Provider>
  )
}

export function useMultiStepForm() {
  const multiStepFormContext = React.useContext(MultiStepFormContext)
  if (multiStepFormContext === undefined) {
    throw new Error(`useMultiStepForm must be used within a MultiStepForm`)
  }

  return multiStepFormContext
}
