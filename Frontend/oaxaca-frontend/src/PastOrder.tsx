import NavBarKitchen from "./data/components/NavBarKitchen";
import StaffFooter from "./data/components/StaffFooter";
import "./css/ManageMenu.css";

export default function PastOrder() {
  return (
    <main>
      <NavBarKitchen />

      <div className="manageMenuPage">
        <h2 className="manageMenuTitle">Past Orders</h2>
        <p className="manageMenuPlaceholder">
          Placeholder: this page will hold kitchen past orders history.
        </p>
      </div>

      <StaffFooter />
    </main>
  );
}
