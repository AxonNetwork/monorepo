export enum NavigationActionType {
    NAVIGATE_NEW_REPO = 'NAVIGATE_NEW_REPO',
    NAVIGATE_SETTINGS = 'NAVIGATE_SETTINGS',
}

export interface INavigateNewRepoAction {
    type: NavigationActionType.NAVIGATE_NEW_REPO
    payload: {}
}

export interface INavigateSettingsAction {
    type: NavigationActionType.NAVIGATE_SETTINGS
    payload: {}
}

export type INavigationAction =
    INavigateNewRepoAction |
    INavigateSettingsAction

export const navigateNewRepo = (): INavigateNewRepoAction => ({ type: NavigationActionType.NAVIGATE_NEW_REPO, payload: {} })
export const navigateSettings = (): INavigateSettingsAction => ({ type: NavigationActionType.NAVIGATE_SETTINGS, payload: {} })

