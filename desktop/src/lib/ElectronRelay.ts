const ipcRenderer = window.require('electron').ipcRenderer

const ElectronRelay = {

	async restartNode() {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('restart_node')
			ipcRenderer.on('node_restarted', ()=>{
				resolve()
			})
		})
	},

}

export default ElectronRelay