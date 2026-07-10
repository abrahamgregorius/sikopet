/** @format */

import { useState, useEffect } from "react";
import { Checkbox, Badge } from "../../../components/ui";
import { db } from "../../../database/db";

const BADGE_VARIANTS = {
  danger: "danger",
  warning: "warning",
  success: "success",
  neutral: "neutral",
};

export default function TaskList({ onOpenModal }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    db.tasks.toArray().then(setTasks);
  }, []);

  const toggleTask = async (id, currentDone) => {
    await db.tasks.update(id, { done: !currentDone });
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !currentDone } : t))
    );
  };

  return (
    <div id="tugas-panel" className="rounded-3xl bg-white border border-[#D8E4EA] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-[#0F172A] text-[16px]">Tugas Saya</h3>
        <button
          onClick={onOpenModal}
          data-tip="Tambah tugas"
          className="focus-ring w-7 h-7 rounded-lg grid place-items-center bg-[#EAF6FB] text-[#2F7698] hover:bg-[#398eb3] hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-[13px] text-[#94A3B8]">Belum ada tugas. Klik + untuk menambah.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-start gap-3">
              <Checkbox
                checked={task.done || false}
                onChange={() => toggleTask(task.id, task.done)}
                className="mt-1"
              />
              <div className="flex-1">
                <p
                  className={`text-[13.5px] font-medium ${
                    task.done ? "text-[#94A3B8] line-through" : "text-[#0F172A]"
                  }`}
                >
                  {task.label || task.title || "Tugas"}
                </p>
                {task.dueDate && (
                  <Badge
                    variant={task.done ? "success" : "warning"}
                    className="!text-[11px] mt-1"
                  >
                    {new Date(task.dueDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
