// src/pages/AuthPage.jsx
import LoginForm from "../components/Auth/LoginForm";
// import logo from "/logo.svg";
import image from "../assets/auth-side.jpg";

export default function AuthPage() {
  return (
    <div className="flex h-screen   ">
      <div className="hidden lg:flex w-1/2 relative p-2">
        <img
          src="/authImg.jpg"
          alt="auth"
          className="h-full w-full object-cover rounded-[20px]"
        />
        <div className="absolute inset-2 bg-black/70 bg-opacity-40 rounded-[20px] flex flex-col justify-end p-10 text-white">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome to <br /><span className="text-orange-400">Admin Panel!</span></h2>
            <p className="text-sm opacity-80">Log in to continue your journey with Kobos.</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
