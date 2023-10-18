import {
  Web3AuthConfig,
  Web3AuthEventListener,
  Web3AuthModalPack,
} from '@safe-global/auth-kit';
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

export async function getWeb3AuthModalPack() {
  // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
  const options: Web3AuthOptions = {
    clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID || '', // https://dashboard.web3auth.io/
    web3AuthNetwork:
      process.env.NEXT_PUBLIC_WEB3_AUTH_NETWORK == 'mainnet'
        ? 'mainnet'
        : 'testnet',
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: process.env.NEXT_PUBLIC_NETWORK_ID || '0x13881',
      rpcTarget:
        process.env.NEXT_PUBLIC_RPC_URL ||
        'https://polygon-mumbai-bor.publicnode.com',
    },
    uiConfig: {
      theme: 'dark',
      loginMethodsOrder: ['google', 'facebook'],
    },
  };

  // https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
  const modalConfig = {
    [WALLET_ADAPTERS.TORUS_EVM]: {
      label: 'torus',
      showOnModal: false,
    },
    [WALLET_ADAPTERS.METAMASK]: {
      label: 'metamask',
      showOnDesktop: true,
      showOnMobile: false,
    },
  };

  // https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: 'mandatory',
    },
    adapterSettings: {
      uxMode: 'popup',
      whiteLabel: {
        name: 'Safe',
      },
    },
  });

  const web3AuthConfig: Web3AuthConfig = {
    txServiceUrl: process.env.NEXT_PUBLIC_WEB3_AUTH_TX_SERVICES,
  };

  const connectedHandler: Web3AuthEventListener = (data) =>
    console.log('CONNECTED', data);
  const disconnectedHandler: Web3AuthEventListener = (data) =>
    console.log('DISCONNECTED', data);

  // Instantiate and initialize the pack
  const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);

  await web3AuthModalPack.init({
    options,
    adapters: [openloginAdapter],
    modalConfig,
  });

  web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler);
  web3AuthModalPack.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler);

  return web3AuthModalPack;
}
