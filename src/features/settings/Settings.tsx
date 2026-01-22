import { useTranslation } from "react-i18next";


const Settings = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-blue-200 p-4 rounded-lg h-[85vh] flex flex-col relative">
      <div className="flex flex-col h-full justify-center items-center mb-4">
        <h1 className="text-xl font-semibold">{t("settings.title")}</h1>
      </div>
    </div>
  );
};

export default Settings;
