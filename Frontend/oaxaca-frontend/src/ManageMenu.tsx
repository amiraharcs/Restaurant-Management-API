import NavBarWaiter from "./data/components/NavBarWaiter";
import StaffFooter from "./data/components/StaffFooter";
import "./css/ManageMenu.css";
import mockAlertsData from "./data/mockAlertsData.json";
import { getTotalNotifications } from "./data/notificationCount.ts";

export default function ManageMenu() {
  const totalNotifications = getTotalNotifications(
    mockAlertsData.mockCallWaiterAlerts || [],
    mockAlertsData.mockOrdersReady || [],
  );

  return (
    <main>
      <NavBarWaiter notificationCount={totalNotifications} />

      <div className="manageMenuPage">
        <h2 className="manageMenuTitle">Manage Menu</h2>
        <p className="manageMenuPlaceholder">
          Placeholder: this page is for menu management (add, edit, and remove items).
        </p>
      </div>

      <StaffFooter />
    </main>
  );
}
