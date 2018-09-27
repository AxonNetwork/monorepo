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
        process: opts.process,
        processOptions: {
            successType: opts.type + '_SUCCESS',
            failType: opts.type + '_FAILED',
            dispatchReturn: true,
        },
    })
}

export interface FailedAction<T extends string> {
    type: T
    payload: Error
    error: boolean
}

