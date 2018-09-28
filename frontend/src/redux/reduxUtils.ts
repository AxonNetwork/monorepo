import { createLogic } from 'redux-logic'

interface ActionType {
    payload: any
}

interface ProcessFunc<HandledActionType extends ActionType, SuccessActionType extends ActionType> {
    (depObj: { getState: Function, action: HandledActionType }, dispatch: Function, done: Function): Promise<SuccessActionType['payload']>
}

export function makeLogic
    <HandledActionType extends ActionType, SuccessActionType extends ActionType>
    (opts: { type: string, process: ProcessFunc<HandledActionType, SuccessActionType> })
{
    return createLogic({
        type: opts.type,
        process: async (depObj, dispatch, done) => {
            try {
                const retval = await Promise.resolve((opts.process as any)(depObj, dispatch, done))
                dispatch({ type: opts.type + '_SUCCESS', payload: retval })
            } catch (err) {
                dispatch({ type: opts.type + '_FAILED', error: true, payload: err })
            }
            done()
        },
    })
}

export interface FailedAction<T extends string> {
    type: T
    payload: Error
    error: boolean
}

