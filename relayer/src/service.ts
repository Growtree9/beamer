import type { ProgramOptions } from "./relayer-program";
import { RelayerProgram } from "./relayer-program";
import { ppid } from "process";
import { killOnParentProcessChange } from "./common/process";
import { program } from "commander";

program
  .requiredOption("--l1RpcURL <URL>", "RPC Provider URL for layer 1")
  .requiredOption("--l2RelayToRpcURL <URL>", "RPC Provider URL for relay destination rollup")
  .requiredOption("--l2RelayFromRpcURL <URL>", "RPC Provider URL for relay source rollup")
  .requiredOption("--walletPrivateKey <hash>", "Private key for the layer 1 wallet")
  .requiredOption(
    "--l2TransactionHash <hash>",
    "Layer 2 transaction hash that needs to be relayed",
  );

program.parse(process.argv);

const args: ProgramOptions = program.opts();

async function main() {
  const startPpid = ppid;

  const relayProgram = await RelayerProgram.createFromArgs(args);

  try {
    await Promise.race([relayProgram.run(), killOnParentProcessChange(startPpid)]);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
