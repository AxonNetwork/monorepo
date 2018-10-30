export function parseCSV(contents: string){
	const lines = contents.split("\n")
	const data = lines.map(line => line.split(","))
	return data
}