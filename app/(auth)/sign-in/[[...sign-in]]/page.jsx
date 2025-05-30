// app/(auth)/sign-in/[[...sign-in]]/page.jsx

import { SignIn } from '@clerk/nextjs';

export default function Page() {
  console.log("Custom SignIn component rendered");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900">
      <SignIn
        forceRedirectUrl="/"
        appearance={{
          elements: {
            card: "shadow-2xl rounded-xl border border-red-600 bg-black/80 text-white p-6 w-full max-w-md backdrop-blur-md",
            formButtonPrimary:
              "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mt-4 transition-all duration-200",
            headerTitle: "text-3xl font-extrabold text-red-500 text-center",
            footerActionText: "text-sm text-gray-400 text-center",
            formFieldLabel: "text-red-400",
            formFieldInput: "bg-gray-800 text-white border border-red-600 placeholder-gray-500",
          },
          variables: {
            colorPrimary: "#FF0000", // Challenger red
            fontFamily: "Outfit, sans-serif",
          },
        }}
      />
    </div>
  );
}
