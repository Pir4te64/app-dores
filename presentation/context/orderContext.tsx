import React, { createContext, useContext, useMemo, useState } from 'react';

interface OrderEventsContextValue {
  ordersRevision: number;
  notifyOrdersChanged: () => void;
}

const OrderEventsContext = createContext<OrderEventsContextValue | undefined>(undefined);

export const OrderEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ordersRevision, setOrdersRevision] = useState(0);

  const notifyOrdersChanged = () => setOrdersRevision((prev) => prev + 1);

  const value = useMemo(
    () => ({ ordersRevision, notifyOrdersChanged }),
    [ordersRevision]
  );

  return <OrderEventsContext.Provider value={value}>{children}</OrderEventsContext.Provider>;
};

export const useOrderEvents = () => {
  const ctx = useContext(OrderEventsContext);
  if (!ctx) throw new Error('useOrderEvents must be used within OrderEventsProvider');
  return ctx;
};

