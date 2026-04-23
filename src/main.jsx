import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  InterwovenKitProvider,
  injectStyles,
  initiaPrivyWalletConnector,
} from "@initia/interwovenkit-react";
import css from "@initia/interwovenkit-react/styles.css?inline";
import App from "./App.jsx";

/* ─── Inject InterwovenKit styles ─── */
injectStyles(css);

/* ─── Wagmi config ─── */
const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});

/* ─── TanStack Query ─── */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

/* ─── Root render ─── */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider
          theme="light"
          enableAutoSign={{
            "interwoven-1": [
              "/cosmos.bank.v1beta1.MsgSend",
              "/initia.move.v1.MsgExecute",
            ],
          }}
        >
          <App />
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </StrictMode>
);
