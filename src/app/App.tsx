import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useLanguageStore } from "@/data/store/useLanguageStore";

const queryClient = new QueryClient();

function App() {
  const initializeLanguage = useLanguageStore(
    (state) => state.initializeLanguage,
  );

  useEffect(() => {
    initializeLanguage();
  }, [initializeLanguage]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
