"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useNotify } from "./ui/notify-ant-rev";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const notify = useNotify();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      notify.error({ title: "Giriş başarısız", description: error.message });
      setLoading(false);
    } else {
      notify.success({ title: "Giriş başarılı", description: "Yönlendiriliyorsunuz..." });
      // Middleware session cookie'yi okuyabilsin diye hard redirect
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("redirectTo") ?? "/admin";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hesabınıza giriş yapın</CardTitle>
        <CardDescription>E-posta ve şifrenizi girin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">E-posta</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Şifre</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Field>
              {/* ❌ onClick={() => handleSubmit} yanlıştı, form zaten onSubmit'e bağlı */}
              <Button type="submit" disabled={loading}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}