'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
