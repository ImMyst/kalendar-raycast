import { Form, ActionPanel, Action, showToast, getPreferenceValues, closeMainWindow, popToRoot, Toast, PopToRootType } from "@raycast/api";
import dayjs from "dayjs";
import { createEvent } from "./create-event";
import { TimeEnum, timeValues } from "./types";
import type { Values } from "./types";

const calendars = getPreferenceValues<Preferences>().calendars.split(", ");

export default function Command() {
  async function handleSubmit(values: Values) {
    const startDate = dayjs(values.startDate);
    const timeToAdd = Number(values.time);
    const endDate =
      values.time === TimeEnum.FullDay ? startDate.toDate() : startDate.add(timeToAdd, "minutes").toDate();
    await createEvent({
      ...values,
      endDate,
    });

    await closeMainWindow({ clearRootSearch: true, popToRootType: PopToRootType.Immediate });
    // await popToRoot();
    await showToast({ title: `Event ${values.emoji} ${values.name} created!`, style: Toast.Style.Success });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Event" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
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
