import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const { t } = useTranslation();
  
  return (
    <div className="p-4 flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">{t("dashboard.welcome")}</h1>
      <p>{t("dashboard.analytics")}</p>
    </div>
  );
}