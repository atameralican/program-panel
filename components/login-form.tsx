"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { useNotify } from "./ui/notify-ant-rev";

type EmailPasswordDemoProps = {
  user: User | null;
};
export function LoginForm({ user }: EmailPasswordDemoProps){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const supabase = getSupabaseBrowserClient();
     const [currentUser, setCurrentUser] = useState<User | null>(user);

     const notify = useNotify()
     //Login button click
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
    notify.error({
      title: "Failed to login",
      description: error?.message,
    })
    // handleSubmit içinde, success bloğuna:
// hard redirect → proxy tetiklenir
    } else {
       notify.success({
      title: "Login Successful",
      description: "Welcome!",
    })
const params = new URLSearchParams(window.location.search);
const redirectTo = params.get("redirectTo") ?? "/admin";
window.location.href = redirectTo; 
    }
  }


  useEffect(() => {
}, [currentUser,user]);
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase])
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email beow to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" onClick={() => handleSubmit}>
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
