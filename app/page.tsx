// src/app/page.tsx — AGT Hub Central
import type { Metadata } from "next";
import HubPageContent from "./components/HubPageContent";

const BASE_URL = "https://assist.ag-technologies.tech";

export const metadata: Metadata = {
  title: "AGT Platform — Hub des Solutions Sectorielles",
  description:
    "AGT Platform propose des assistants virtuels IA pour 9 secteurs d'activité : PME, Clinique, Hôtel, Restaurant, Banque, École, E-commerce, Voyage et Secteur Public.",
};

export default function HubPage() {
  return <HubPageContent />;
}