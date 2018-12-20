import path from 'path'

export function getConscienceURI(repoID: string, filename: string){
	if(filename !== undefined){
		return 'conscience://' + path.join(repoID, filename)
	}else {
		return 'conscience://' + repoID
	}
}

