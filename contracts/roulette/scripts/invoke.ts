import { Contract, Account, RpcProvider, CallData, cairo } from "starknet";
import * as dotenv from "dotenv";
import { getCompiledCode } from "./utils";
dotenv.config();

async function spinRoulette() {
  const provider = new RpcProvider({
    nodeUrl: process.env.RPC_ENDPOINT,
  });

  const privateKey: string = process.env.DEPLOYER_PRIVATE_KEY as string;
  const accountAddress: string = process.env.DEPLOYER_ADDRESS as string;

  // Initialize the account
  const account = new Account(provider, accountAddress, privateKey);

  // Define the contract
  const contractAddress: string = process.env.CONTRACT_ADDRESS as string;
  let sierraCode;

  try {
    ({ sierraCode } = await getCompiledCode("roulette_RouletteContract"));
  } catch (error: any) {
    console.log("Failed to read contract files");
    process.exit(1);
  }
  const abi = sierraCode.abi;

  const contract = new Contract(abi, contractAddress, account);

  try {
    // const tx = await contract.invoke("increase_counter", []);
    // console.log("Transaction submitted:", tx.transaction_hash);
    const tx = await account.execute([
      {
        contractAddress: process.env.CONTRACT_ADDRESS || "",
        entrypoint: "spin_roulette",
        calldata: CallData.compile({
          bets: [
            {
              amount: cairo.uint256(100),
              numbers: [1, 2, 3],
            },
            {
              amount: cairo.uint256(100),
              numbers: [4, 5, 6],
            },
          ],
        }),
      },
    ]);
    // const tx =
  } catch (error) {
    console.error("Error invoking function:", error);
  }
}

spinRoulette();
