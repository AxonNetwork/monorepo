import { createLogic } from 'redux-logic'
import { FETCHED_OTHER_USER_INFO } from './user/userActions'
import ServerRelay from '../lib/ServerRelay'

export async function getNames(emails, users, dispatch){
    const toFetch = emails.filter(e=>users[e]===undefined)
    const fetched = await ServerRelay.fetchUsers(toFetch)
    await Promise.all(fetched.map(u=>{
        dispatch({
            type: FETCHED_OTHER_USER_INFO,
            user: u
        })
    }))
    const names = emails.reduce((acc, cur)=>{
        if(users[cur] !== undefined){
            acc[cur]=users[cur].name
        }else{
            acc[cur]=fetched.find(u=>u.email===cur).name
        }
        return acc
    },{})
    return names
}


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


