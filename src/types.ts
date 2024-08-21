export enum TimeEnum {
  TenMinutes = "10",
  FifteenMinutes = "15",
  ThirtyMinutes = "30",
  FourtyFiveMinutes = "45",
  OneHour = "60",
  TwoHours = "180",
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
    time: TimeEnum.TenMinutes,
    text: "10min",
  },
  {
    time: TimeEnum.FifteenMinutes,
    text: "15min",
  },
  {
    time: TimeEnum.ThirtyMinutes,
    text: "30min",
  },
  {
    time: TimeEnum.FourtyFiveMinutes,
    text: "45min",
  },
  {
    time: TimeEnum.OneHour,
    text: "1h",
  },
  {
    time: TimeEnum.TwoHours,
    text: "2h",
  },
  {
    time: TimeEnum.FullDay,
    text: "Journée",
  },
] as const;
