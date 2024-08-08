import type { AppProps } from "next/app";
// import { Inter } from '@next/font/google';
import "tailwindcss/tailwind.css";
import { ThirdwebProvider } from "thirdweb/react";

// const inter = Inter({
//   subsets: ["latin"],
//   preload: true,
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
// });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider>
      <div>
        <Component {...pageProps} />
      </div>
    </ThirdwebProvider>
  );
}

export default MyApp;
