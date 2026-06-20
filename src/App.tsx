import { Route, Switch } from "wouter";

import HomePage from "./pages/HomePage";
import VideosPage from "./pages/VideosPage";

import About from "./pages/About";
import Author from "./pages/Author";
import StorePage from "./pages/StorePage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import AdminLayout from "./pages/admin/AdminLayout";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/videos" component={VideosPage} />
      <Route path="/about" component={About} />
      <Route path="/author" component={Author} />
      <Route path="/store" component={StorePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin/:rest*" component={AdminLayout} />
      <Route component={NotFound} />
    </Switch>
  );
}
