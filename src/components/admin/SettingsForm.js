'use client';

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner';

const cancellationRuleSchema = z.object({
  days: z.coerce.number().int().min(0, "Days must be non-negative"),
  percentage: z.coerce.number().int().min(0, "Percentage must be between 0 and 100"),
});

const settingsSchema = z.object({
  cancellationPolicy: z.array(cancellationRuleSchema),
});


export function SettingsForm({ settings }) {
  const { token } = useAuth();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
        cancellationPolicy: settings?.cancellationPolicy || [{days: 0, percentage: 0}]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cancellationPolicy",
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/admin/settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ key: 'cancellationPolicy', value: data.cancellationPolicy }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update settings`);
      }

      toast.success(`Settings updated successfully!`);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <Label className="text-lg font-semibold">Cancellation Policy</Label>
            <div className="space-y-4 mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 p-4 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`cancellationPolicy.${index}.days`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Days Before</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 7" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`cancellationPolicy.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Refund Percentage</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 100" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ days: 0, percentage: 0 })}
            >
              Add Rule
            </Button>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : "Save Settings"}
          </Button>
        </form>
      </Form>
    </>
  );
}
