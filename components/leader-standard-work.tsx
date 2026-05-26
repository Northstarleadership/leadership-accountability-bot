"use client";

import { useState } from "react";
import type { LeaderStandardWork } from "@/lib/types";

type LeaderStandardWorkProps = {
  items: LeaderStandardWork[];
};

const frequencyOptions = ["Daily", "Weekly", "Monthly"];

const categoryOptions = [
  "Leadership",
  "Communication",
  "Accountability",
  "Development",
  "Strategy",
  "Operations"
];

export function LeaderStandardWork({ items }: LeaderStandardWorkProps) {
  const [localItems, setLocalItems] = useState(items);
  const [activity, setActivity] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [category, setCategory] = useState("Leadership");
  const [notes, setNotes] = useState("");

  async function submit() {
    const response = await fetch("/api/leader-standard-work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activity, frequency, category, notes })
    });

    const newItem = await response.json();
    setLocalItems((current) => [newItem, ...current]);
    setActivity("");
    setFrequency("Daily");
    setCategory("Leadership");
    setNotes("");
    }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Operating Rhythm</p>
          <h2>Leader Standard Work</h2>
        </div>
      </div>

      <p className="muted">
        Define recurring leadership routines that drive execution consistency.
      </p>

      <div className="mt-6 grid gap-4">
        <input
          className="input"
          placeholder="Leadership activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />

        <select
          className="input"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          {frequencyOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <textarea
          className="input min-h-[100px]"
          placeholder="Optional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="button-primary" onClick={submit} type="button">
          Add Leader Standard Work
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {localItems.length === 0 ? (
          <p className="text-sm text-gray-500">
            No leader standard work defined yet.
          </p>
        ) : (
          localItems.map((item) => (
            <div
  key={item.id}
  style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "16px",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#f9fafb"
  }}
>
              <button
  style={{
    display: "inline-flex",
    width: "fit-content",
    whiteSpace: "nowrap",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontWeight: 600
  }}
  type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("add-lsw-priority", {
                      detail: item.activity
                    })
                  );
                }}
              >
                Add to Today
              </button>

              <p className="font-semibold">
                {item.activity}{" "}
                <div className="flex items-center gap-2">
  <span
    className={`rounded-full px-2 py-1 text-xs font-semibold ${
      item.frequency === "Daily"
        ? "bg-teal-100 text-teal-700"
        : item.frequency === "Weekly"
        ? "bg-blue-100 text-blue-700"
        : "bg-purple-100 text-purple-700"
    }`}
  >
    {item.frequency}
  </span>

  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
    {item.category}
  </span>
</div>
                {item.notes ? (
                  <span className="font-normal text-sm text-gray-600">
                    {" "}• {item.notes}
                  </span>
                ) : null}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}