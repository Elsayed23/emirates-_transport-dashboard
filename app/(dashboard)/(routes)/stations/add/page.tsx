'use client';
import { Input } from "@/components/ui/input";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import registrationImage from '@/app/assets/images/registration_image.webp'

const formSchema = z.object({
    name: z.string().min(1, { message: "Invalid field." }),
    filterName: z.string().min(1, { message: "Invalid field." }),
    translationName: z.string().min(1, { message: "Invalid field." }),
});

const page = () => {

    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            filterName: '',
            translationName: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await axios.post('/api/station', values);

            router.push('/stations')


        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4">
            <div className="min-h-[calc(100vh-148px)] flex justify-center items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full sm:w-[370px] gap-7 mx-auto">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Station name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="Station name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="filterName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Filter name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="Filter name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="translationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Translation name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="Translation name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting || !isValid}>Save</Button>
                    </form>
                </Form>
            </div>

        </div>
    );
};

export default page;