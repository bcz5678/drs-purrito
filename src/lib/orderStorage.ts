export type StoredOrder = {
  pickup_number: string;
  protein: string | null;
  rice: string[];
  toppings: string[];
  sides: string[];
  drinks: string[];
  items: { id: string; name: string; price: number }[];
  total: number;
  created_at: string;
};

const KEY_PREFIX = "purrito-order:";

export function saveOrder(order: StoredOrder) {
  try {
    localStorage.setItem(KEY_PREFIX + order.pickup_number, JSON.stringify(order));
  } catch {
    // localStorage unavailable (private mode, disabled, quota) - order just won't persist
  }
}

export function loadOrder(pickupNumber: string): StoredOrder | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + pickupNumber);
    return raw ? (JSON.parse(raw) as StoredOrder) : null;
  } catch {
    return null;
  }
}
