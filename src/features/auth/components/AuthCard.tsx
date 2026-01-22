import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Images } from "@/data/constants/images.constants";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <>
      <div className=" flex justify-center">
        <img
          src={Images.logos.main}
          alt="Supernova Logo"
          className="h-[57px] md:h-[90px] width-[168px]"
        />
      </div>
      <Card className="w-full max-w-[468px] border-none !p-8">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-center text-brand-primary text-2xl font-semibold">
            {title}
          </CardTitle>
          <span className="text-center text-grey-400 !mt-3">{description}</span>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
}
