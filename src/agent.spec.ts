import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  TransactionEvent,
} from "forta-agent";

import agent, {
  BOT_DEPLOY_FUNCTION,
  FORTA_ADDRESS,
  NETHERMIND_BOT_DEPLOY_ADDRESS
} from "./agent";

import { TestTransactionEvent } from "forta-agent-tools/lib/tests";
import { createAddress } from "forta-agent-tools/lib/tests";


describe("Nethermind bot deploy bot", () => {
  
  //data value is from transaction 0x6ca3f2f3c383f44732d1a4808b4c7b6f6d2a94adf57403cc01a0c18837edbd93
  const data: string = "0x7935d5b41ebdeb7c258149125a199078496162cafd9ee57a1c5466a5fa72f86fc3dfa90b00000000000000000000000088dc3a2284fa62e0027d6d6b1fcfdd2141a143b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000002e516d533736645269597a4443446e6d61637a616131396b7432557731584c627368325271436f694d504d3361736b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000380000000000000000000000000000000000000000000000000000000000000089000000000000000000000000000000000000000000000000000000000000a86a";

  
  describe("handleTransaction", () => {

    //Empty findings

    it("returns empty findings if there are no createAgent calls & there is no interaction with the Forta contract & the transaction was not sent by Nethermind", async () => {
      
      const transaction: TransactionEvent = new TestTransactionEvent().setFrom(createAddress("0x0")).setTo(createAddress("0x0"));
      const findings = await agent.handleTransaction(transaction);

      expect(findings).toStrictEqual([]);
      
    });

    it("returns empty findings if there is interaction with the Forta contract but there are no createAgent calls & the transaction was not sent by Nethermind", async () => {
      
      const transaction: TransactionEvent = new TestTransactionEvent().setFrom(createAddress("0x0")).setTo(FORTA_ADDRESS);
      const findings = await agent.handleTransaction(transaction);

      expect(findings).toStrictEqual([]);
      
    });

    it("returns empty findings if the transaction was sent by Nethermind but there are no createAgent calls & there is no interaction with the Forta contract", async () => {
      
      const transaction: TransactionEvent = new TestTransactionEvent().setFrom(NETHERMIND_BOT_DEPLOY_ADDRESS).setTo(createAddress("0x0"));
      const findings = await agent.handleTransaction(transaction);

      expect(findings).toStrictEqual([]);
      
    });

    it("returns empty findings if there is interaction with the Forta contract & there are createAgent calls but the transaction was not sent by Nethermind", async () => {
      
      const transaction: TransactionEvent = new TestTransactionEvent().setFrom(createAddress("0x0")).setTo(FORTA_ADDRESS).setData(data);
      const findings = await agent.handleTransaction(transaction);

      expect(findings).toStrictEqual([]);
      
    });

    it("returns empty findings if there are createAgent calls & the transaction was sent by Nethermind but there is no interaction with the Forta contract", async () => {
      
      const transaction: TransactionEvent = new TestTransactionEvent().setFrom(NETHERMIND_BOT_DEPLOY_ADDRESS).setTo(createAddress("0x0")).setData(data);
      const findings = await agent.handleTransaction(transaction);

      expect(findings).toStrictEqual([]);
      
    });


    //Transaction found

    it("returns findings if there are createAgent calls & there is interaction with the Forta contract & the transaction was sent by Nethermind", async () => {
      
      const transaction: TransactionEvent = new TestTransactionEvent().setFrom(NETHERMIND_BOT_DEPLOY_ADDRESS).setTo(FORTA_ADDRESS).setData(data);
      const findings = await agent.handleTransaction(transaction);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Nethermind Forta Bot Deploy",
          description: `Bot with Id: 13904944810115728534044878841341330843295539786158750503865156600844309735691 deployed by Nethermind`,
          alertId: "NETHERMIND-1",
          protocol: "forta",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            metadata: "QmS76dRiYzDCDnmaczaa19kt2Uw1XLbsh2RqCoiMPM3ask",
          },
        }),
      ]);
      
    });

    
  });
});
