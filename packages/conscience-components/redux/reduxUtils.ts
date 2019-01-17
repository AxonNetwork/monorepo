import { createLogic } from 'redux-logic'

interface ActionType {
    payload: any
}

interface ProcessFunc<HandledActionType extends ActionType, SuccessActionType extends ActionType, IGlobalState> {
    (depObj: { getState: () => IGlobalState, action: HandledActionType }, dispatch: Function, done: Function): Promise<SuccessActionType['payload'] | Error | void>
}

// interface ProcessFuncNoReturn<HandledActionType extends ActionType> {
//     (depObj: { getState: () => IGlobalState, action: HandledActionType }, dispatch: Function, done: Function): void
// }

// export function makeLogic
//     <HandledActionType extends ActionType, undefined>
//     (opts: { type: string, warnTimeout?: number, process: ProcessFuncNoReturn<HandledActionType> })
export function makeLogic
    <HandledActionType extends ActionType, SuccessActionType extends ActionType, IGlobalState = any>
    (opts: { type: string, warnTimeout?: number, process: ProcessFunc<HandledActionType, SuccessActionType, IGlobalState> }) {
    return createLogic({
        type: opts.type,
        warnTimeout: opts.warnTimeout || 60000,
        process: async (depObj, dispatch, done) => {
            try {
                const retval = await Promise.resolve((opts.process as any)(depObj, dispatch, done))
                if (retval instanceof Error) {
                    dispatch({ type: opts.type + '_FAILED', error: true, payload: retval })
                } else {
                    dispatch({ type: opts.type + '_SUCCESS', payload: retval })
                }
                done()

            } catch (err) {
                dispatch({ type: opts.type + '_FAILED', error: true, payload: err })
                done()
                throw err
            }
        },
    })
}

interface ContinuousProcessFunc<HandledActionType extends ActionType, IGlobalState> {
    (depObj: { getState: () => IGlobalState, action: HandledActionType }, dispatch: Function, done: Function): void
}

export function makeContinuousLogic
    <HandledActionType extends ActionType, IGlobalState = any>
    (opts: { type: string, warnTimeout?: number, process: ContinuousProcessFunc<HandledActionType, IGlobalState> }) {
    return createLogic({
        type: opts.type,
        warnTimeout: 0,
        process: opts.process,
    })
}

export interface FailedAction<T extends string> {
    type: T
    payload: Error
    error: boolean
}

