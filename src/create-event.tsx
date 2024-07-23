import { showToast, Toast } from "@raycast/api";
import osascript from "osascript-tag";
import { TimeEnum, Values } from "./types";

export const createEvent = async (item: Values) => {
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
        alldayEvent: ${item.time === TimeEnum.FullDay}
      })
      projectCalendar.events.push(event)
    `);

  executeJxa(script);
};

const executeJxa = async (script: string) => {
  try {
    const result = await osascript.jxa({ parse: true })`${script}`;
    return result;
  } catch (err: unknown) {
    if (typeof err === "string") {
      const message = err.replace("execution error: Error: ", "");
      console.log(err);
      showToast(Toast.Style.Failure, "Something went wrong", message);
    }
  }
};
