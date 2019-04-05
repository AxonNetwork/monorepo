import { IRepoAction } from 'conscience-components/redux/repo/repoActions'
import repoReducer, { initialState, IRepoState } from 'conscience-components/redux/repo/repoReducer'

const webInitialState = {
    ...initialState,
}

declare module 'conscience-components/redux/repo/repoReducer' {
    export interface IRepoState {
    }
}

const webRepoReducer = (state: IRepoState, action: IRepoAction): IRepoState => {
    switch (action.type) {
        default:
            return state
    }
}

export default function(state: IRepoState = webInitialState, action: IRepoAction): IRepoState {
    state = repoReducer(state, action as IRepoAction)
    state = webRepoReducer(state, action)
    return state
}
