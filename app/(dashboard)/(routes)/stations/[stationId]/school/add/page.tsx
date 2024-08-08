'use client';
import { Input } from "@/components/ui/input";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, { message: "Invalid field." }),
    translationName: z.string().min(1, { message: "Invalid field." }),
    contract: z.string().min(1, { message: "Invalid field." }),
});

const page = ({
    params: { stationId }
}: { params: { stationId: string } }) => {

    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            translationName: '',
            contract: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await axios.post('/api/school', { ...values, stationId });

            router.push(`/stations/${stationId}`)


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
                                    <FormLabel>School name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="Station name..." {...field} />
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
                        <FormField
                            control={form.control}
                            name="contract"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="Contract..." {...field} />
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