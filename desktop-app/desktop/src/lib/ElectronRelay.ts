const ipcRenderer = window.require('electron').ipcRenderer

const ElectronRelay = {

	async startNode() {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('start_node')
			ipcRenderer.on('node_started', ()=>{
				resolve()
			})
		})
	},

	async killNode() {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('kill_node')
			ipcRenderer.on('node_killed', ()=>{
				resolve()
			})
		})
	},
}

export default ElectronRelay