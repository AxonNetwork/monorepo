import { RepoPage } from '../common'

export function repoPageToString(repoPage: RepoPage){
    switch(repoPage){
        case RepoPage.Files:
	        return 'files'
        case RepoPage.History:
        	return 'history'
        case RepoPage.Discussion:
	        return 'discussion'
        case RepoPage.Settings:
	        return 'settings'
        case RepoPage.Home:
        default:
	        return 'home'
    }
}

export function stringToRepoPage(str: string){
     switch(str){
        case 'files':
            return RepoPage.Files
        case 'history':
            return RepoPage.History
        case 'discussion':
            return RepoPage.Discussion
        case 'settings':
            return RepoPage.Settings
        case 'home':
        default:
            return RepoPage.Home
    }
}