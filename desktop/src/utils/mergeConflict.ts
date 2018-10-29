export enum ChunkType {
	NoConflict,
	Upstream,
	Local
}

export interface IChunk {
	type: ChunkType
	lineStart: number
	lines: string[]
}

export function parseMergeConflict(contents: string) {
	const lines = contents.split('\n')
	let chunks = [] as IChunk[]
	let currentChunkType = ChunkType.NoConflict as ChunkType
	let chunkStart = 0
	for(let i=0; i<lines.length ;i++) {
		const line = lines[i]
		if( line.indexOf('<<<<<<<') > -1 ||
			line.indexOf('=======') > -1 ||
			line.indexOf('>>>>>>>') > -1 ||
			i === lines.length - 1
		) {
			const chunk = lines.slice(chunkStart, i)
			if(chunk.length > 0 || currentChunkType !== ChunkType.NoConflict)
			chunks.push({
				type: currentChunkType,
				lineStart: chunkStart,
				lines: chunk,
			} as IChunk)
			chunkStart = i+1

			if(line.indexOf('<<<<<<<') > -1) {
				currentChunkType = ChunkType.Upstream
			}
			if(line.indexOf('=======') > -1) {
				currentChunkType = ChunkType.Local
			}
			if(line.indexOf('>>>>>>>') > -1) {
				currentChunkType = ChunkType.NoConflict
			}
		}
	}

	return chunks
}