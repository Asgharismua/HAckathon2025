import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

interface AdviceInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function AdviceInput({ onSubmit, isLoading, disabled }: AdviceInputProps) {
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (!isLoading && !disabled) {
      onSubmit(values.query.trim());
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base md:text-lg font-semibold">
                {t("queryLabel")}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t("queryPlaceholder")}
                  className="min-h-[120px] text-base resize-none rounded-xl border-2 focus-visible:ring-2"
                  disabled={isLoading || disabled}
                  data-testid="input-query"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto min-w-[200px]"
          disabled={isLoading || disabled}
          data-testid="button-get-advice"
        >
          {isLoading ? (
            <span>{t("loading")}</span>
          ) : (
            <>
              <Send className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              {t("getAdviceBtn")}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
