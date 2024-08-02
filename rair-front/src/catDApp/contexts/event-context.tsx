import { createContext } from "react";

type EventContextType = {
  events: any[]; // TODO export event type
  isLoading: boolean;
};

export const EventContext = createContext<EventContextType>({
  events: [],
  isLoading: true,
});
