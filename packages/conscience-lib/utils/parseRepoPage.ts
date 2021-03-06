import { RepoPage } from '../common'

export function repoPageToString(repoPage: RepoPage) {
    switch (repoPage) {
        case RepoPage.Files:
            return 'files/HEAD'
        case RepoPage.History:
            return 'history'
        case RepoPage.Discussion:
            return 'discussion'
        case RepoPage.Team:
            return 'team'
        case RepoPage.Settings:
            return 'settings'
        case RepoPage.Home:
        default:
            return 'home'
    }
}

export function stringToRepoPage(pathname: string) {
    const base = pathname.split('/')[3]
    switch (base) {
        case 'files':
        case 'edit':
            return RepoPage.Files
        case 'history':
            return RepoPage.History
        case 'discussion':
            return RepoPage.Discussion
        case 'team':
            return RepoPage.Team
        case 'settings':
            return RepoPage.Settings
        case 'home':
        default:
            return RepoPage.Home
    }
}