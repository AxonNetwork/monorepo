import TruffleContract from 'truffle-contract'
import Web3 from 'web3'
import ProtocolJSON from './contracts/Protocol.json'

let protocolContract

export async function getProtocolContract() {
    if (protocolContract !== undefined) {
        return protocolContract
    }

    const Protocol = TruffleContract(ProtocolJSON)
    const provider = new Web3.providers.HttpProvider(process.env.GETH_NODE)
    Protocol.setProvider(provider)
    if (typeof Protocol.currentProvider.sendAsync !== 'function') {
        Protocol.currentProvider.sendAsync = function () {
            return Protocol.currentProvider.send.apply(Protocol.currentProvider, arguments)
        }
    }
    protocolContract = await Protocol.deployed()
    return protocolContract
}
