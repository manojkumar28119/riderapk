import SignInForm from "../components/SignInForm";
import AuthCard from "../components/AuthCard";
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const { t } = useTranslation();

  return (
    <AuthCard
      title={t("auth.signInPage.title")}
      description={t("auth.signInPage.description")}
    >
      <SignInForm />
    </AuthCard>
  );
}
