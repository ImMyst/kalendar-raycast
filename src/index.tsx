import { Form, ActionPanel, Action, showToast, getPreferenceValues } from "@raycast/api";
import { executeJxa } from "./useCalendar";
import dayjs from "dayjs";

enum TimeEnum {
  TenMinutes = "10",
  FifteenMinutes = "15",
  ThirtyMinutes = "30",
  OneHour = "60",
  FullDay = "1440",
}

interface Preferences {
  calendars: string;
}

type Values = {
  name: string;
  description: string;
  emoji: string;
  startDate: Date;
  endDate: Date;
  time: TimeEnum;
  calendar: string;
};

const timeValues = [
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

const calendars = getPreferenceValues<Preferences>().calendars.split(", ");
console.log(calendars);

export default function Command() {
  const createEvent = async (item: Values) => {
    const script = `
      var app = Application.currentApplication()
      app.includeStandardAdditions = true
      var Calendar = Application("Calendar")
      var date = new Date(${item.startDate.getTime()})
      Calendar.viewCalendar({at: date})
    `;

    executeJxa(`
      var app = Application.currentApplication()
      app.includeStandardAdditions = true
      var Calendar = Application("Calendar")
      
      var eventStart = new Date(${item.startDate.getTime()})
      var eventEnd = new Date(${item.endDate.getTime()})

      var projectCalendars = Calendar.calendars.whose({name: "${item.calendar}"})
      var projectCalendar = projectCalendars[0]
      var event = Calendar.Event({
        summary: "${item.emoji ?? ""} ${item.name}", 
        description: "${item.description}",
        startDate: eventStart, 
        endDate: eventEnd,
        alldayEvent: ${item.time === TimeEnum.FullDay},
      })
      projectCalendar.events.push(event)
    `);

    executeJxa(script);
  };

  async function handleSubmit(values: Values) {
    console.log(values);
    const startDate = dayjs(values.startDate);
    const timeToAdd = Number(values.time);
    const endDate =
      values.time === TimeEnum.FullDay ? startDate.toDate() : startDate.add(timeToAdd, "minutes").toDate();
    await createEvent({
      ...values,
      endDate,
    });
    showToast({ title: "Submitted form", message: "See logs for submitted values" });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField id="name" autoFocus title="Nom" placeholder="Faire la vaisselle ..." />
      <Form.TextField id="emoji" title="Emoji" placeholder="🤷‍♂️" />
      <Form.TextArea id="description" title="Description" placeholder="Sinon ça va être la merde ..." />
      <Form.Separator />
      <Form.DatePicker id="startDate" type={Form.DatePicker.Type.DateTime} title="Date" />
      <Form.Dropdown id="time" title="Temps">
        {timeValues.map(({ time, text }) => (
          <Form.Dropdown.Item key={time} value={time} title={text} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown defaultValue={calendars[0]} id="calendar" title="Calendrier">
        {calendars?.map((calendar, key) => <Form.Dropdown.Item key={key} value={calendar} title={calendar} />)}
      </Form.Dropdown>
    </Form>
  );
}
