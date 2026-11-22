import { createRoot } from "react-dom/client";
import { CheckoutPage } from "./components/CheckoutPage";

const container = document.getElementById("checkout-root");
if (container) {
  createRoot(container).render(<CheckoutPage />);
}
