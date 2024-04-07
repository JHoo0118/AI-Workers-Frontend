import LeaveContainer from "@/components/Account/Settings/LeaveContainer";
import SettingsContainer from "@/components/Account/Settings/SettingsContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "설정",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export default function SettingsPage() {
  return (
    <div>
      <h3>details</h3>
      <SettingsContainer />
      <h3 className="mt-10">leave</h3>
      <LeaveContainer />
    </div>
  );
}
