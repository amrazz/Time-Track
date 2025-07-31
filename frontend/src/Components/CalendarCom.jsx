import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AnimatePresence, motion } from "motion/react";

const CalendarCom = ({
  getCalendarEvents,
  setSelectedDate,
  setShowTaskModal,
  tasks,
  setEditingTask,
}) => {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800 text-white rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl text-center font-semibold ">CALENDAR</h2>
        <p className="text-sm text-center text-gray-400">
          View tasks by due date
        </p>
      </div>

      <div className="p-6">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={getCalendarEvents()}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          validRange={{
            start: new Date().toISOString().split("T")[0],
          }}
          height={600}
          aspectRatio={1.35}
          nowIndicator={true}
          editable={true}
          selectable={true}
          dayMaxEventRows={3}
          eventDisplay="block"
          dateClick={(info) => {
            setSelectedDate(info.dateStr);
            setShowTaskModal(true);
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }}
          eventClick={(info) => {
            const task = tasks.find((t) => (t.id || t._id) === info.event.id);
            if (task) setEditingTask(task);
          }}
          eventClassNames="cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-all"
          dayHeaderClassNames="font-semibold text-gray-700 cursor-pointer"
          dayCellClassNames={(arg) =>
            arg.date < new Date() ? "bg-gray-800" : "hover:bg-gray-800"
          }
        />
      </div>
      <style jsx="true">{`
        .calendar-container .fc {
          font-family: inherit;
        }

        .calendar-container .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          color: #111827 !important;
        }

        .calendar-container .fc-button {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          color: #475569 !important;
          border-radius: 0.5rem !important;
          padding: 0.375rem 0.75rem !important;
          font-weight: 500 !important;
          transition: all 0.2s !important;
        }

        .calendar-container .fc-button:hover {
          background: #e2e8f0 !important;
          border-color: #cbd5e1 !important;
          color: #334155 !important;
        }

        .calendar-container .fc-button-active {
          background: #3b82f6 !important;
          border-color: #2563eb !important;
          color: white !important;
        }

        .calendar-container .fc-event {
          border-radius: 0.25rem !important;
          padding: 1px 3px !important;
          margin: 1px 0 !important;
          font-size: 0.75rem !important;
        }

        .calendar-container .fc-day-today {
          background-color: #eff6ff !important;
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarCom;
