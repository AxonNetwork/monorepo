import TruffleContract from 'truffle-contract'
import Web3 from 'web3'
import ProtocolJSON from './contracts/Protocol.json'
import UserRegistryJSON from './contracts/UserRegistry.json'

let protocolContract
let userRegistryContract

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
    protocolContract = await Protocol.at(process.env.PROTOCOL_CONTRACT_ADDRESS)
    return protocolContract
}

export async function getUserRegistryContract() {
    if (userRegistryContract !== undefined) {
        return userRegistryContract
    }

    const UserRegistry = TruffleContract(UserRegistryJSON)
    const provider = new Web3.providers.HttpProvider(process.env.GETH_NODE)
    UserRegistry.setProvider(provider)
    if (typeof UserRegistry.currentProvider.sendAsync !== 'function') {
        UserRegistry.currentProvider.sendAsync = function () {
            return UserRegistry.currentProvider.send.apply(UserRegistry.currentProvider, arguments)
        }
    }
    userRegistryContract = await UserRegistry.at(process.env.USER_REGISTRY_CONTRACT_ADDRESS)
    return userRegistryContract
}


