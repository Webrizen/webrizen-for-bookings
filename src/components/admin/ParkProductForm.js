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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner';

const parkProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["full-day", "half-day"]),
  prices: z.array(
    z.object({
      ageGroup: z.string().min(1, "Age group is required"),
      price: z.coerce.number().positive("Price must be positive"),
    })
  ).min(1, "At least one price is required"),
});

export function ParkProductForm({ parkProduct }) {
  const { token } = useAuth();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(parkProductSchema),
    defaultValues: parkProduct || {
      name: "",
      description: "",
      type: "full-day",
      prices: [{ ageGroup: "", price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prices",
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        parkProduct ? `/api/admin/park-products/${parkProduct._id}` : "/api/admin/park-products",
        {
          method: parkProduct ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${parkProduct ? "update" : "create"} park product`);
      }

      toast.success(`Park Product ${parkProduct ? "updated" : "created"} successfully!`);
      router.push("/admin/park-products");
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Adult Day Pass" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Full day access to all rides..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a ticket type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-day">Full Day</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label>Prices</Label>
            <div className="space-y-4 mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 p-4 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`prices.${index}.ageGroup`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Age Group</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Adult" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`prices.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Price (INR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Price" {...field} />
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
              onClick={() => append({ ageGroup: "", price: 0 })}
            >
              Add Price
            </Button>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : (parkProduct ? "Update Product" : "Create Product")}
          </Button>
        </form>
      </Form>
    </>
  );
}
