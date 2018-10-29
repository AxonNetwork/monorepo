export enum ChunkType {
	NoConflict,
	Conflict
}

export type IChunk = IChunkConflict | IChunkNoConflict

export interface IChunkNoConflict {
	type: ChunkType.NoConflict
	lineStart: number
	lines: string[]
}

export interface IChunkConflict {
	type: ChunkType.Conflict
	lineStart: number
	linesUpstream: string[]
	linesLocal: string[]
	upstreamMessage: string
	localMessage: string
}

enum LineType {
	Normal,
	UpstreamStart,
	LocalStart,
	ConflictEnd
}

function getLineType(line: string){
	if(line.indexOf('<<<<<<<') > -1){
		return LineType.UpstreamStart
	}
	if(line.indexOf('=======') > -1){
		return LineType.LocalStart
	}
	if(line.indexOf('>>>>>>>') > -1){
		return LineType.ConflictEnd
	}
	return LineType.Normal
}


export function parseMergeConflict(contents: string) {
	const lines = contents.split('\n')
	let chunks = [] as IChunk[]
	let currentChunk = {
		type: ChunkType.NoConflict,
		lineStart: 0,
		lines: [] as string[],
	} as IChunk
	let isUpstream = undefined

	for(let i=0; i<lines.length ;i++) {
		const line = lines[i]
		const lineType = getLineType(line)
		switch (lineType) {

			case LineType.Normal:
				if(currentChunk.type == ChunkType.NoConflict){
					currentChunk.lines.push(line)
				}else if(isUpstream === true){
					currentChunk.linesUpstream.push(line)
				}else{
					currentChunk.linesLocal.push(line)
				}
				break

			case LineType.UpstreamStart:
				chunks.push(currentChunk)
				currentChunk = {
					type: ChunkType.Conflict,
					lineStart: i+1,
					linesUpstream: [] as string[],
					linesLocal: [] as string[],
					upstreamMessage: line.substr(8, line.length-1) || "",
					localMessage: ""
				}
				isUpstream = true
				break

			case LineType.LocalStart:
				isUpstream = false
				break

			case LineType.ConflictEnd:
				(currentChunk as IChunkConflict).localMessage = line.substr(8, line.length -1) || ""
				chunks.push(currentChunk)
				currentChunk = {
					type: ChunkType.NoConflict,
					lineStart: i+1,
					lines: [] as string[]
				}
				isUpstream = undefined
				break
		}
		if( i === lines.length-1 && lineType !== LineType.ConflictEnd){
			chunks.push(currentChunk)
		}
	}

	return chunks
}

export function combineChunks(chunks: IChunk[]){
	let content = ""
	for(let i=0; i<chunks.length; i++){
		const chunk = chunks[i]
		switch(chunk.type){

			case ChunkType.NoConflict:
				content += chunk.lines.join("\n")
				break

			case ChunkType.Conflict:
				content += `<<<<<<< ${chunk.upstreamMessage}\n`
				content += chunk.linesUpstream.join("\n") + "\n"
				content += "=======\n"
				content += chunk.linesLocal.join("\n") + "\n"
				content += `>>>>>>> ${chunk.localMessage}`
				break
		}
		if( i !== chunks.length-1 ){
			content += "\n"
		}
	}
	return content
}