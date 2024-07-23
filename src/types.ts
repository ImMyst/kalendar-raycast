export enum TimeEnum {
  TenMinutes = "10",
  FifteenMinutes = "15",
  ThirtyMinutes = "30",
  OneHour = "60",
  FullDay = "1440",
}

export interface Preferences {
  calendars: string;
}

export type Values = {
  name: string;
  description: string;
  emoji: string;
  startDate: Date;
  endDate: Date;
  time: TimeEnum;
  calendar: string;
};

export const timeValues = [
  {
    time: "10",
    text: "10min",
  },
  {
    time: "15",
    text: "15min",
  },
  {
    time: "30",
    text: "30min",
  },
  {
    time: "60",
    text: "1h",
  },
  {
    time: "1440",
    text: "Journée",
  },
] as const;
