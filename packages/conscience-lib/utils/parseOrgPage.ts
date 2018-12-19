import { OrgPage } from '../common'

export function orgPageToString(orgPage: OrgPage){
    switch(orgPage){
        case OrgPage.Settings:
	        return 'settings'
        case OrgPage.Editor:
        	return 'editor'
        case OrgPage.Home:
        default:
	        return 'home'
    }
}

export function stringToOrgPage(pathname: string){
    const base = pathname.split('/')[3]
    switch(base){
        case 'settings':
            return OrgPage.Settings
        case 'editor':
            return OrgPage.Editor
        case 'home':
        default:
            return OrgPage.Home
    }
}