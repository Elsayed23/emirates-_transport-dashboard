'use client';

import { useEffect, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useTranslation from '@/app/hooks/useTranslation';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

const Register = ({ roles }: any) => {

    const [passwordError, setPasswordError] = useState<string | null>(null);


    const formSchema = z.object({
        name: z.string().min(1, { message: "Name field is required" }),
        email: z.string().email({ message: "Invalid email address." }),
        password: z.string().min(4, { message: "Password must be at least 4 characters." }),
        repeatPassword: z.string().min(4, { message: "Password must be at least 4 characters." }),
        roleId: z.string().min(1, { message: "You must choose the role" }),
        gender: z.string().min(1, { message: "You must choose the gender" }),
        financialNumber: z.string().min(1, { message: "The Financial number field is required" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            repeatPassword: '',
            roleId: '',
            gender: '',
            financialNumber: ''
        },
    });
    const { t } = useTranslation()

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { password, repeatPassword } = values
            if (password !== repeatPassword) {
                setPasswordError("Passwords don't match");
                return;
            } else {
                setPasswordError(null);
            }

            const { data } = await axios.post('/api/auth/register', values)
            const { message } = data

            toast.success(message)

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex items-center w-full mx-auto justify-center py-7">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full sm:w-[370px] gap-7 mx-auto">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" disabled={isSubmitting} placeholder="Repeat Password" {...form.register("repeatPassword")} />
                        </FormControl>
                        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    </FormItem>
                    <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role: any) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="MALE" id="male" />
                                                <Label className='cursor-pointer' htmlFor="male">Male</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="FEMALE" id="female" />
                                                <Label className='cursor-pointer' htmlFor="female">Female</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="financialNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Financial Number</FormLabel>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="Financial Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting || !isValid}>Register</Button>
                </form>

            </Form>
        </div>
    )
}

const Page = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
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


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('/api/roles');
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                toast.error('Failed to fetch roles');
            }
        };

        fetchRoles();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { data } = await axios.post('/api/auth/login', values);
            const { status, token, message } = data;
            if (status === 200) {
                loginUser(token);
                toast.success('Successfully logged in');
            } else {
                toast.info(message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full place-content-center lg:place-content-stretch lg:grid min-h-screen lg:grid-cols-2">
            <div className="flex items-center w-full px-4 mx-auto justify-center py-12">
                <div className="flex flex-col w-full sm:w-fit items-center gap-5 p-5 border rounded-md">
                    <h1 className="text-3xl font-bold">{isRegister ? 'Register' : 'Login'}</h1>
                    {!isRegister ? (
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
                                <div className="flex flex-col gap-2">
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
                                    <span onClick={() => router.push('/forget_password')} className='underline text-sm cursor-pointer'>Forgot Password?</span>
                                </div>
                                <Button type="submit" disabled={isSubmitting || !isValid}>Login</Button>
                            </form>
                        </Form>
                    ) : (
                        <Register roles={roles} />
                    )}
                    <div className="mt-4 text-center text-sm">
                        {isRegister ? (
                            <span>
                                Already have an account?{" "}
                                <button onClick={() => setIsRegister(false)} className="underline">
                                    Login
                                </button>
                            </span>
                        ) : (
                            <span>
                                Don&apos;t have an account?{" "}
                                <button onClick={() => setIsRegister(true)} className="underline">
                                    Sign up
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                <Image
                    src={require('@/app/assets/images/logo.svg')}
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="w-1/2 fixed right-0 h-full object-none"
                />
            </div>
        </div>
    );
};

export default Page;
