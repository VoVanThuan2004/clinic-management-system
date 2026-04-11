import { RouterProvider } from "react-router-dom";
import AppProviders from "./app/provider";
import routes from "./routes/routes";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={routes} />
    </AppProviders>
  );
}

export default App;
