// src/pages/AuthPage.jsx
import LoginForm from "../components/Auth/LoginForm";
import logo from "/logo.svg";
import image from "../assets/auth-side.jpg";

export default function AuthPage() {
  return (
    <div className="flex h-screen">
      <div className="w-3/4 hidden lg:block">
        <img
          src={image}
          alt="auth"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-full lg:w-2/4 flex flex-col justify-center p-8">
        <img src={logo} alt="Logo" className="w-32 mb-3 mx-auto" />
        <h1 className="text-2xl font-bold text-center mb-2">Admin DashBoard</h1>
        <LoginForm />
      </div>
    </div>
  );
}
