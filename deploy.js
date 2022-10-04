const ethers = require("ethers")
const fs = require("fs")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD
    // )
    // wallet = wallet.connect(provider)

    //ABI and BINARY for wallet
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying SC, please wait...")
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)

    console.log(`Contract adderess : ${contract.address}`)

    const favNum = await contract.retrieve()
    console.log(`Current fav num : ${favNum.toString()}`)

    const storeResponse = await contract.store("7")
    await storeResponse.wait(1)
    const newFavNum = await contract.retrieve()
    console.log(`New fav num : ${newFavNum.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log("Error :", err)
        process.exit(1)
    })
