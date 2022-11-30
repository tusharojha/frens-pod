import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { getHuddleClient, HuddleClientProvider } from '@huddle01/huddle01-client'
import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ConfigProvider } from 'antd';

export default function App({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [chain.polygon],
    [
      publicProvider()
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: 'Frens Pod',
    chains
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  });


  const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY)
  return (
    <HuddleClientProvider value={huddleClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#cd9b3f',
          accentColorForeground: 'white',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small',
        })} chains={chains}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#cd9b3f',
              },
            }}
          >
            <Component {...pageProps} />
          </ConfigProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </HuddleClientProvider>
  );
}
