type HandledItem = {
  handled: boolean;
};

export function getUnhandledCount(items: HandledItem[]): number {
  return items.filter((item) => !item.handled).length;
}

export function getTotalNotifications(
  callWaiterAlerts: HandledItem[],
  ordersReady: HandledItem[],
): number {
  return getUnhandledCount(callWaiterAlerts) + getUnhandledCount(ordersReady);
}
