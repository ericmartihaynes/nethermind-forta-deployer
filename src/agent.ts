import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

export const BOT_DEPLOY_FUNCTION = "function createAgent(uint256 agentId, address owner, string metadata, uint256[] chainIds)";
export const FORTA_ADDRESS = "0x61447385b019187daa48e91c55c02af1f1f3f863";
export const NETHERMIND_BOT_DEPLOY_ADDRESS = "0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  

  // filter the transaction logs for createAgent function at the Forta contract address
  const fortaDeployEvents = txEvent.filterFunction(BOT_DEPLOY_FUNCTION, FORTA_ADDRESS);
    
  
  
  fortaDeployEvents.forEach((deployEvent) => {
    //extract deploy arguments
    const { agentId, owner, metadata, chainIds } = deployEvent.args;
    

    // if a forta bot was deployed by the nethermind deploy address, report it
    if (txEvent.from.toLowerCase() == NETHERMIND_BOT_DEPLOY_ADDRESS) {
      findings.push(
        Finding.fromObject({
          name: "Nethermind Forta Bot Deploy",
          description: `Bot with Id: ${agentId} deployed by Nethermind`,
          alertId: "NETHERMIND-1",
          protocol: "forta",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            metadata: metadata,
          },
        })
      );
      
    }
  });

  return findings;
};

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

export default {
  handleTransaction,
  // handleBlock
};
