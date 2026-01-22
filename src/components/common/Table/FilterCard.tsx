import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "@components/common/form-field-wrapper";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import { useEffect } from "react";
import { FilterField } from "@/hooks";

interface FilterCardProps {
  filterFields: FilterField[];
  handleFieldClick?: (fieldName: string) => void;
  filters?: Record<string, unknown>;
  className?: string;
}

const createFilterSchema = (fields: FilterField[]) => {
  const shape: Record<string, unknown> = {};
  fields.forEach((f) => {
    switch (f.type) {
      case "number":
        shape[f.name] = z
          .string()
          .optional()
          .transform((v) => (v ? Number(v) : undefined));
        break;
      case "select":
        shape[f.name] = z.string().optional();
        break;
      case "date":
        shape[f.name] = z.string().optional();
        break;
      default:
        shape[f.name] = z.string().optional();
    }
  });
  return z.object(shape);
};

export const FilterCard = ({
  filterFields,
  filters,
  handleFieldClick,
}: FilterCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const schema = createFilterSchema(filterFields);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: filterFields.reduce(
      (acc, f) => {
        acc[f.name] = f.defaultValue ?? "";
        return acc;
      },
      {} as Record<string, unknown>
    ),
    mode: "onTouched",
  });

  useEffect(() => {
    form.reset(filters);
    // Explain: we want to reset form when filters prop changes and not on every form change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryParamValues: Record<string, unknown> = {};

    filterFields.forEach((field) => {
      const paramValue = queryParams.get(field.name);
      if (paramValue) {
        queryParamValues[field.name] = paramValue.trim();
      }
    });

    if (Object.keys(queryParamValues).length > 0) {
      form.reset({
        ...filterFields.reduce(
          (acc, f) => {
            acc[f.name] = f.defaultValue ?? "";
            return acc;
          },
          {} as Record<string, unknown>
        ),
        ...queryParamValues,
      });
    }
  }, [location.search, filterFields, form]);

  const handleSubmit = form.handleSubmit((values) => {

    // Create a URLSearchParams object from the existing URL
    const searchParams = new URLSearchParams(location.search);

    // Append or update new values
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        searchParams.set(key, value.toString().trim()); // updates if exists, adds if not
      } else {
        searchParams.delete(key); // clean up empty fields
      }
    }

    navigate(`.?${searchParams.toString()}`);
  });

  const handleReset = () => {
    // Reset form fields to empty
    const clearedFilters = filterFields.reduce(
      (acc, f) => {
        acc[f.name] = "";
        return acc;
      },
      {} as Record<string, unknown>
    );

    form.reset(clearedFilters);

    const searchParams = new URLSearchParams(location.search);

    // remove only the filter-related params
    filterFields.forEach((f) => searchParams.delete(f.name)); // delete all filter-related params

    // navigate with cleaned-up params
    navigate(`.?${searchParams.toString()}`);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <Card className="border border-blue-200 p-4 rounded-lg mb-4">
        <CardContent>
          <Form {...form}>
            <form className="flex flex-wrap gap-4 items-start">
              {filterFields.map((field) =>
                field.type === "groupSelect" || field.type === "date" ? (
                  <FormFieldWrapper
                    control={form.control}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={form.watch(field.name) || filters?.[field.name]}
                    type={field.type}
                    key={field.name}
                    isLoading={field.isLoading}
                    options={field.options}
                    className="!h-9 !mt-0 w-full md:w-auto md:flex-1 md:min-w-[220px] md:max-w-[240px] font-normal text-sm"
                  />
                ) : (
                  <FormFieldWrapper
                    control={form.control}
                    name={field.name}
                    placeholder={field.placeholder}
                    type={field.type}
                    key={field.name}
                    isLoading={field.isLoading}
                    options={field.options}
                    {...(field.type === "select" && {
                      cutomfunctionality: () => handleFieldClick?.(field.name),
                    })}
                    className="!h-9 !mt-0 w-full md:w-auto md:flex-1 md:min-w-[220px] md:max-w-[240px] font-normal text-sm"
                  />
                )
              )}

              <div className="flex gap-2 items-center ml-auto">
                <Button
                  type="submit"
                  className="text-sm h-9"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="text-sm h-9"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
