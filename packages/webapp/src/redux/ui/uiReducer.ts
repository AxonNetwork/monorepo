import { IRepoAction } from '../repo/repoActions'

const initialState = {}

export interface IUIState {}

const uiReducer = (state: IUIState = initialState, action: IRepoAction): IUIState => {
    return state
}

export default uiReducer
