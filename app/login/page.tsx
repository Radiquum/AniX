import { LoginPage } from "#/pages/Login";

export const metadata = {
  title: "Авторизация",
  description: "Вход в аккаунт anixart",
}

export const dynamic = "force-static";

export default function Login() {
  return <LoginPage />;
}
