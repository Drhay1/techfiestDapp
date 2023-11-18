import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { polygon, polygonMumbai, mainnet } from '@wagmi/chains';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import React, { Suspense, lazy } from 'react';
import packageInfo from '../package.json';
import CacheBuster from 'react-cache-buster';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';
import 'swiper/css';
import PageLoader from './reusable/components/PageLoader';
import { GetWalletProvider } from './store/contextProviders/connectWallet';
import store from './store/store';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import AntDProvider from './reusable/components/AntDProvider';

const {
  VITE_ALCHEMY_API_KEY,
  VITE_WALLET_APP_NAME,
  VITE_WALLET_CONNECT_PROJECTID,
} = import.meta.env;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon, polygonMumbai, mainnet],
  [alchemyProvider({ apiKey: VITE_ALCHEMY_API_KEY! }), publicProvider()],
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: VITE_WALLET_APP_NAME!,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: VITE_WALLET_CONNECT_PROJECTID!,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

let persister = persistStore(store);

function App() {
  return (
    <CacheBuster
      currentVersion={packageInfo.version}
      isEnabled={true}
      isVerboseMode={false}
      loadingComponent={<PageLoader />}
      metaFileDirectory={'.'}
      onCacheClear={() => {}}
    >
      <AntDProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persister}>
            <WagmiConfig config={wagmiConfig}>
              <GetWalletProvider>
                <HelmetProvider>
                  <Router>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(() => import('./pages/Home/Homepage')),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/client-signup"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import('./pages/Auth/Client/ClientSignup'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/user-signup"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () => import('./pages/Auth/User/UserSignup'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(() => import('./pages/Auth/Login')),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/adashboard"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import('./pages/Users/Admin/AdminDashboard'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/cdashboard"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () => import('./pages/Users/Client/CDashboard'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import('./pages/Users/User/UserDashboard'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/cdetail/:id/:slug"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import(
                                    './pages/Users/Client/HackathonDetail'
                                  ),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/cdetail/:id/:slug/payout"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(() => import('./pages/Users/Client/Payout')),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/admin/hacks/:id/:slug"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import(
                                    './pages/Users/Admin/AdminHackathonDetail'
                                  ),
                              ),
                            )}
                          </Suspense>
                        }
                      />

                      <Route
                        path="/admin/hacks/edit/:id/:slug"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import(
                                    './pages/Users/Admin/AdminEditHackathon'
                                  ),
                              ),
                            )}
                          </Suspense>
                        }
                      />

                      <Route
                        path="/admin/hacks/edit-offchain/:id/:slug"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import(
                                    './pages/Users/Admin/AdminEditOffChainHackathon'
                                  ),
                              ),
                            )}
                          </Suspense>
                        }
                      />

                      <Route
                        path="/hackathons"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import('./pages/Hackathons/AllHackathons'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/arequests"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import('./pages/Users/Admin/AdminRequests'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/invite-users"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import(
                                    './pages/Users/Admin/AdminInviteUsers'
                                  ),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () => import('./pages/Auth/ProfileSettings'),
                              ),
                            )}
                          </Suspense>
                        }
                      />

                      <Route
                        path="/hacks/:id/:slug"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import(
                                    './pages/Users/User/UserHackathonDetail'
                                  ),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/recover-password"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () => import('./pages/Auth/RecoverPassword'),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/reset-password"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(() => import('./pages/Auth/UpdatePassword')),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="/create-hackathon"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(
                                () =>
                                  import(
                                    './pages/Users/Client/CreateHackathon'
                                  ),
                              ),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="terms-and-conditions"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(() => import('./pages/Others/Terms')),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="imprint"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(() => import('./pages/Others/Imprint')),
                            )}
                          </Suspense>
                        }
                      />
                      <Route
                        path="*"
                        element={
                          <Suspense fallback={<PageLoader />}>
                            {React.createElement(
                              lazy(() => import('./pages/Errors/Notfound')),
                            )}
                          </Suspense>
                        }
                      />
                    </Routes>
                  </Router>
                </HelmetProvider>
              </GetWalletProvider>
            </WagmiConfig>
          </PersistGate>
        </Provider>
      </AntDProvider>
    </CacheBuster>
  );
}

export default App;
