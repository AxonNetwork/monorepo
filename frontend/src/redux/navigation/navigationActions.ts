// action types
export const NAVIGATE_NEW_REPO = 'NAVIGATE_NEW_REPO'
export const NAVIGATE_SETTINGS = 'NAVIGATE_SETTINGS'
export const NAVIGATE_REPO_FILES = 'NAVIGATE_REPO_FILES'
export const NAVIGATE_REPO_HISTORY = 'NAVIGATE_REPO_HISTORY'

export const actionTypes = {
    NAVIGATE_NEW_REPO,
    NAVIGATE_SETTINGS,
    NAVIGATE_REPO_FILES,
    NAVIGATE_REPO_HISTORY
}

// action creators
export const navigateNewRepo = () => ({ type: NAVIGATE_NEW_REPO })
export const navigateSettings = () => ({ type: NAVIGATE_SETTINGS })
export const navigateRepoFiles = () => ({ type: NAVIGATE_REPO_FILES })
export const navigateRepoHistory = () => ({ type: NAVIGATE_REPO_HISTORY })

export const actionCreators = {
    navigateNewRepo,
    navigateSettings,
    navigateRepoFiles,
    navigateRepoHistory
}
