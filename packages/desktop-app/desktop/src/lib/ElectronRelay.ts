const ipcRenderer = window.require('electron').ipcRenderer

const ElectronRelay = {

	startNode() {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('start_node')
			ipcRenderer.on('node_started', () => {
				resolve()
			})
		})
	},

	killNode() {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('kill_node')
			ipcRenderer.on('node_killed', () => {
				resolve()
			})
		})
	},

    checkForUpdate(callbacks: {
        updateAvailable: () => void
        updateNotAvailable: () => void
        updateDownloaded: () => void
        error: (err: Error) => void
    }) {
        console.log('(renderer) checkForUpdate')

        ipcRenderer.send('update:check')

        ipcRenderer.on('update:available', () => {
            console.log('(renderer) update:available')
            callbacks.updateAvailable()
        })
        ipcRenderer.on('update:not-available', () => {
            console.log('(renderer) update:not-available')
            callbacks.updateNotAvailable()
        })
        ipcRenderer.on('update:downloaded', () => {
            console.log('(renderer) update:downloaded')
            callbacks.updateDownloaded()
        })
        ipcRenderer.on('update:download-progress', (a: any, b: any, c: any, d: any, e: any, f: any) => {
            console.log('(renderer) update:download-progress', {a, b, c, d, e, f})
        })
        ipcRenderer.on('update:error', (err: Error) => {
            console.error('(renderer) update:error', err)
            callbacks.error(err)
        })
    },

    quitAndInstallUpdate() {
        ipcRenderer.send('update:quit-and-install')
    },
}

export default ElectronRelay