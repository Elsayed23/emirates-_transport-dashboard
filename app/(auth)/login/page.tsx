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
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

const page = () => {

    const { login: loginUser } = useAuth();
    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const { data } = await axios.post('/api/auth/login', values);

            const { status, token, message } = data;

            if (status === 200) {
                loginUser(token);
                toast.success('Successfully login')
            } else {
                toast.info(message);
            }

            console.log(values);


        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full lg:grid min-h-screen lg:grid-cols-2">
            <div className="flex items-center w-full mx-auto justify-center py-12">
                <div className="flex flex-col items-center gap-5 p-5 border rounded-md">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full sm:w-[370px] gap-7 mx-auto">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input disabled={isSubmitting} placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" disabled={isSubmitting} placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting || !isValid}>Login</Button>
                        </form>
                    </Form>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src={registrationImage}
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-fill"
                />
            </div>
        </div>
    );
};

export default page;


/*

 

*/