import { Outlet } from "react-router-dom";
import SiteNavigation from "./components/SiteNavigation";
import { GlobalContext } from "./contexts";
import useFetchFromApi from "./hooks/useFetchFromApi";

function App() {
  const {
    data,
    refetch: refetchUser,
    reset: clearUser,
  } = useFetchFromApi("/user/me");
  const user = data?.user;

  return (
    <GlobalContext.Provider value={{ user, refetchUser, clearUser }}>
      <SiteNavigation />
      <main>
        <Outlet />
      </main>
    </GlobalContext.Provider>
  );
}

export default App;
