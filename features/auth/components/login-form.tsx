"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignIn(formData: FormData) {
    setPending(true);
    const { error } = await authClient.signIn.email({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    setPending(false);
    if (error) {
      toast.error(error.message ?? "Sign in failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleSignUp(formData: FormData) {
    setPending(true);
    const { error } = await authClient.signUp.email({
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    setPending(false);
    if (error) {
      toast.error(error.message ?? "Sign up failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your Personal OS. Creating an account is only possible
          once — this system has a single owner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sign-in">
          <TabsList className="w-full">
            <TabsTrigger value="sign-in" className="flex-1">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="flex-1">
              First-time setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in">
            <form action={handleSignIn} className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="si-email">Email</Label>
                <Input
                  id="si-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="si-password">Password</Label>
                <Input
                  id="si-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="sign-up">
            <form action={handleSignUp} className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="su-name">Name</Label>
                <Input id="su-name" name="name" required autoComplete="name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="su-email">Email</Label>
                <Input
                  id="su-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="su-password">Password</Label>
                <Input
                  id="su-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create owner account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
