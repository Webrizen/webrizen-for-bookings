'use client';

import { useForm } from "react-hook-form";
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
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Toaster, toast } from 'sonner';

const roomTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  // For simplicity, amenities are handled as a comma-separated string
  amenities: z.string().optional(),
});

export function RoomTypeForm({ roomType }) {
  const { token } = useAuth();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: roomType ? {
        ...roomType,
        amenities: roomType.amenities?.join(', ') || ''
    } : {
      name: "",
      description: "",
      price: 0,
      amenities: "",
    },
  });

  const onSubmit = async (data) => {
    const processedData = {
        ...data,
        amenities: data.amenities ? data.amenities.split(',').map(s => s.trim()) : []
    };

    try {
      const response = await fetch(
        roomType ? `/api/admin/room-types/${roomType._id}` : "/api/admin/room-types",
        {
          method: roomType ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(processedData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${roomType ? "update" : "create"} room type`);
      }

      toast.success(`Room Type ${roomType ? "updated" : "created"} successfully!`);
      router.push("/admin/room-types");
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
                  <Input placeholder="E.g., Deluxe Suite" {...field} />
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
                  <Textarea placeholder="A luxurious suite with a view..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per night (INR)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Wi-Fi, AC, TV" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : (roomType ? "Update Room Type" : "Create Room Type")}
          </Button>
        </form>
      </Form>
    </>
  );
}
