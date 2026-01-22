import NavBar from "@/components/layout/MainLayout/NavBar";
import SideBar from "@/components/layout/MainLayout/SideBar";
import { Spinner } from "@/components/ui/spinner";
import { useLoaderStore } from "@data/store/useLoaderStore";
import { Copyright } from "@data/constants/icons.constants";
import { Outlet } from "react-router-dom";

/**
 * Main layout component for authenticated users
 * 
 * NOTE: Session expiry logic is handled by SessionExpiryProvider (parent wrapper)
 * This component is completely independent of session state management
 * It only cares about layout structure and UI rendering
 */
export default function MainLayout() {
  const isLoading = useLoaderStore((state) => state.isLoading);

  // console.log("MainLayout rendered");

  return (
    <div className="h-screen bg-blue-50">
      {/* Fixed Navbar - spans full width */}
      <NavBar />
      
      {/* Container for Sidebar and Main Content - below navbar */}
      <div className="flex pt-[60px] h-full">
        {/* Sidebar - positioned below navbar */}
        <SideBar />
    
        {/* Main Content - scrollable area */}
        <main className="flex-1 relative h-full overflow-hidden p-6 pb-10">
          <div className="relative h-full w-full">
            {isLoading && <Spinner overlay size="xl" color="primary" />}
            <Outlet />
          </div>
          <div className="flex absolute bottom-1 left-0 right-0 items-center justify-center ">
            <Copyright size={16} />
            <span className="font-normal text-sm">United Movers. All Rights Reserved.</span>
          </div>
        </main> 
      </div> 
    </div>
  );
}
