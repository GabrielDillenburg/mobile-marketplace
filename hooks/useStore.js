import { createContext, useContext } from 'react';

/**
 * @type {React.Context<import('../stores/containers/rootStore').default>}
 */
const RootStoreContext = createContext({});

/**
 * The provider our root component will use to expose the root store
 */
export const RootStoreProvider = RootStoreContext.Provider;

/**
 * A hook that screens can use to gain access to our stores, with
 * `const { someStore, someOtherStore } = useStores()`,
 * or less likely: `const rootmStore = useStores()`
 */
export const useStore = () => useContext(RootStoreContext);
