import HTTPError from '../util/HTTPError'
import HDWalletProvider from 'truffle-hdwallet-provider'
import Web3 from 'web3'
import Promise from 'bluebird'

const MAX_AMOUNT = 10

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.GETH_NODE, 0, 1)

const web3 = new Web3(provider)
Promise.promisifyAll(web3.eth)
const faucetController = {}

faucetController.ethFaucet = async (req, res, next) => {
    const { address, amount } = req.body
    if (!address) {
        throw new HTTPError(400, 'Missing field: address')
    } else if (!amount) {
        throw new HTTPError(400, 'Missing field: amount')
    }

    // If the user already has enough ETH, don't do anything.
    const balance = web3.utils.toBN( await web3.eth.getBalanceAsync(address) )
    const maxAmount = web3.utils.toBN( web3.utils.toWei(`${MAX_AMOUNT}`, 'ether') )
    if (balance.gte( maxAmount )) {
        return res.status(200).json({ result: 'you have plenty of ETH already' })
    }

    const accounts = await web3.eth.getAccountsAsync()
    const faucet = accounts[0]
    const wei = web3.utils.toWei(Math.min(amount, MAX_AMOUNT).toString(), 'ether')
    await web3.eth.sendTransactionAsync({ from: faucet, to: address, value: wei })

    return res.status(200).json({ result: 'sent you some ETH' })
}

faucetController.getBalance = async (req, res, next) => {
    const { address } = req.query
    if (!address) {
        throw new HTTPError(400, 'Missing field: address')
    }

    const balanceWei = await web3.eth.getBalanceAsync(address)
    const balance = web3.utils.fromWei(balanceWei, 'ether')

    return res.status(200).json({ balance })
}

export default faucetController

