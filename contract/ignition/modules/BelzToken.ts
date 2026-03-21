

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const BelzTokenModule = buildModule("BelzTokenModule", (m) => {

  const btoken = m.contract("BelzToken");

  return { btoken };
});

export default BelzTokenModule;
