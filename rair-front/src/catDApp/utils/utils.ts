import { EventProps } from "../components/events";

export function shortenAddress(address: string): string {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
}

export function isOwnEvent(
  event: EventProps,
  address: string | undefined
): boolean {
  const { type, data } = event;
  return (
    (type === "LevelUp" && data.account === address) ||
    (type === "Miaowed" &&
      (data.victim === address || data.attacker === address))
  );
}
