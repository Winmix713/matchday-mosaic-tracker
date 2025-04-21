
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  country: z.string().min(2, { message: "Country must be at least 2 characters" }),
  season: z.string().min(4, { message: "Please enter a valid season (e.g. 2023-2024)" }),
});

type FormValues = z.infer<typeof formSchema>;

interface NewLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  initialData?: FormValues;
  title?: string;
}

const NewLeagueModal: React.FC<NewLeagueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Add New League"
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      country: "",
      season: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="bg-gray-800 text-white border-gray-700">
        <SheetHeader>
          <SheetTitle className="text-white">{title}</SheetTitle>
          <SheetDescription className="text-gray-300">
            Fill out the form below to create a new league.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">League Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Premier League" 
                      className="bg-gray-700 text-white border-gray-600" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Country</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="England" 
                      className="bg-gray-700 text-white border-gray-600" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Season</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="2023-2024" 
                      className="bg-gray-700 text-white border-gray-600" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Save League
              </button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewLeagueModal;
