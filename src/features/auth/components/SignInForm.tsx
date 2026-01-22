import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { loginSchema } from "@/data/schemas/auth.schema";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "@components/common/form-field-wrapper";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const { t } = useTranslation();

  // const { toast } = useToast();
  const navigate = useNavigate();

  // React Hook Form setup
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  // Submit handler
  const onSubmit = (data: LoginFormValues) => {
    console.log("Form Submitted", data);
    navigate("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {/* Email Field */}
        <FormFieldWrapper
          control={form.control}
          name="email"
          label={t("auth.email")}
          required={true}
        />

        {/* Password Field */}
        <FormFieldWrapper
          control={form.control}
          name="password"
          label={t("auth.password")}
          required={true}
          ActionLink={
            <Link
              to="/forgot-password"
              className="text-sm text-brand-secondary font-medium underline hover:text-brand-primary/80 cursor-pointer"
            >
              {t("auth.forgotPasswordLink")}{" "}
            </Link>
          }
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-brand-primary font-normal text-white hover:bg-brand-primary/90 mt-6"
        >
          {t("auth.signInButton")}
        </Button>
      </form>
    </Form>
  );
}
