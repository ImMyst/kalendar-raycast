import {
  Form,
  Toast,
  Action,
  showToast,
  ActionPanel,
  PopToRootType,
  closeMainWindow,
  getPreferenceValues,
} from "@raycast/api";
import { useForm } from "@raycast/utils";
import dayjs from "dayjs";

import { createEvent } from "./create-event";
import { TimeEnum, timeValues } from "./types";
import type { Values } from "./types";

const calendars = getPreferenceValues<Preferences>().calendars.split(", ");

export default function Command() {
  const { handleSubmit, itemProps } = useForm<Values>({
    async onSubmit(values) {
      const startDate = dayjs(values.startDate);
      const timeToAdd = Number(values.time);
      const endDate =
        values.time === TimeEnum.FullDay ? startDate.toDate() : startDate.add(timeToAdd, "minutes").toDate();
      await createEvent({
        ...values,
        endDate,
      });

      await closeMainWindow({ clearRootSearch: true, popToRootType: PopToRootType.Immediate });
      await showToast({ title: `Event ${values.emoji} ${values.name} created!`, style: Toast.Style.Success });
    },
    initialValues: {
      calendar: calendars[0],
    },
    validation: {
      startDate: (value) => {
        const currentDate = new Date();
        if (!value) {
          return "Requis";
        }
        if (new Date(value) < currentDate) {
          return "Doit être dans le futur";
        }
      },
      calendar: (value) => {
        if (!value) {
          return "Requis";
        }
      },
      name: (value) => {
        if (!value) {
          return "Requis";
        }
      },
      time: (value) => {
        if (!value) {
          return "Requis";
        }
      },
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Event" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField autoFocus title="Nom" placeholder="Faire la vaisselle ..." {...itemProps.name} />
      <Form.TextField title="Emoji" placeholder="🤷‍♂️" {...itemProps.emoji} />
      <Form.TextArea title="Description" placeholder="Sinon ça va être la merde ..." {...itemProps.description} />
      <Form.Separator />
      <Form.DatePicker type={Form.DatePicker.Type.DateTime} title="Date" {...itemProps.startDate} />
      <Form.Dropdown
        title="Temps"
        {...(itemProps.time as Partial<Form.ItemProps<string>> & {
          id: string;
        })}
      >
        {timeValues.map(({ time, text }) => (
          <Form.Dropdown.Item key={time} value={time} title={text} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown title="Calendrier" {...itemProps.calendar}>
        {calendars?.map((calendar, key) => <Form.Dropdown.Item key={key} value={calendar} title={calendar} />)}
      </Form.Dropdown>
    </Form>
  );
}
