"use client";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  argent,
  braavos,
  Connector,
  publicProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { ReactNode } from "react";

const StarknetProvider = ({ children }: { children: ReactNode }) => {
  const chains = [mainnet, sepolia];
  const { connectors: injected } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "always",
  });

  const ArgentMobile = ArgentMobileConnector.init({
    options: {
      dappName: "Lottery Starknet",
      url: "https://lottery-dapp-starknet.vercel.app/",
    },
    inAppBrowserOptions: {},
  });

  const connectors = [
    ...injected,
    new WebWalletConnector({
      url: "https://web.argent.xyz",
    }) as never as Connector,
    ArgentMobile as never as Connector,
  ];

  return (
    <StarknetConfig
      chains={chains}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider;
