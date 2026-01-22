import { Outlet } from "react-router-dom";
import { useLoaderStore } from "@data/store/useLoaderStore";
import { Card } from "@/components/ui/card";
import { Images } from "@/data/constants/images.constants";
import { Spinner } from "@/components/ui/spinner";
import { LanguageSelector } from "@/components/common/languageSelector";

export default function AuthLayout() {
  const { isLoading } = useLoaderStore();

  return (
    <div className="flex h-screen bg-brand-bgwhite relative">
      {isLoading && (
        <Spinner
          overlay
          size="xl"
          overlayClassName="bg-black/20"
          color="primary"
        />
      )}
      {/* Language Selector - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>
      <main className="flex  w-full ">
        <Card
          className="hidden md:flex flex-col justify-end w-1/2 border-none bg-cover bg-no-repeat bg-center rounded-none p-10 "
          style={{ backgroundImage: `url(${Images.layout.auth.bgImage})` }}
        >
          <div className="text-white flex flex-col">
            <span className="text-[20px] font-semibold mb-2">
              One Platform. Every Operation.
            </span>
            <span className="text-[56px] font-bold">Simplified.</span>
          </div>
        </Card>

        <div className="flex flex-col justify-center items-center h-full w-full md:w-1/2 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
