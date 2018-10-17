import { createLogic } from 'redux-logic'
import { IGlobalState } from './store'

interface ActionType {
    payload: any
}

interface ProcessFunc<HandledActionType extends ActionType, SuccessActionType extends ActionType> {
    (depObj: { getState: () => IGlobalState, action: HandledActionType }, dispatch: Function, done: Function): Promise<SuccessActionType['payload']|void>
}

export function makeLogic
    <HandledActionType extends ActionType, SuccessActionType extends ActionType>
    (opts: { type: string, warnTimeout?: number, process: ProcessFunc<HandledActionType, SuccessActionType> })
{
    return createLogic({
        type: opts.type,
        warnTimeout: opts.warnTimeout || 60000,
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

interface ContinuousProcessFunc<HandledActionType extends ActionType> {
    (depObj: { getState: () => IGlobalState, action: HandledActionType }, dispatch: Function, done: Function): void
}

export function makeContinuousLogic
    <HandledActionType extends ActionType>
    (opts: { type: string, warnTimeout?: number, process: ContinuousProcessFunc<HandledActionType> })
{
    return createLogic({
        type: opts.type,
        warnTimeout: 0,
        process: opts.process
    })
}

export interface FailedAction<T extends string> {
    type: T
    payload: Error
    error: boolean
}

