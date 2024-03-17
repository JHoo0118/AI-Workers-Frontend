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
    </div>
  );
}
