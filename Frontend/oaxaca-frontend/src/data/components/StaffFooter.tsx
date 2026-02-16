import "../../css/StaffFooter.css";
import {
  LuChefHat,
  LuClipboardList,
  LuBellRing,
  LuShieldCheck,
  LuUsers,
} from "react-icons/lu";

export default function StaffFooter() {
  return (
    <footer className="staffFooter">
      <div className="staffFooter__content">
        <div className="staffFooter__brandBlock">
          <div className="staffFooter__markWrap">
            <LuChefHat className="staffFooter__mark" />
          </div>
          <p className="staffFooter__brand">OAXACA</p>
          <p className="staffFooter__meta">Staff Operations Dashboard</p>
          <p className="staffFooter__meta">Service Hours: 11:00 - 23:00</p>

          <div className="staffFooter__iconRow" aria-label="Staff shortcuts">
            <span className="staffFooter__iconBadge" title="Kitchen">
              <LuChefHat />
            </span>
            <span className="staffFooter__iconBadge" title="Orders">
              <LuClipboardList />
            </span>
            <span className="staffFooter__iconBadge" title="Alerts">
              <LuBellRing />
            </span>
            <span className="staffFooter__iconBadge" title="Team">
              <LuUsers />
            </span>
            <span className="staffFooter__iconBadge" title="Compliance">
              <LuShieldCheck />
            </span>
          </div>
        </div>

        <div className="staffFooter__column">
          <p className="staffFooter__heading">Operations</p>
          <p className="staffFooter__item">Active Orders</p>
          <p className="staffFooter__item">Live Status Tracking</p>
          <p className="staffFooter__item">Shift Handover</p>
          <p className="staffFooter__item">Service Flow</p>
        </div>

        <div className="staffFooter__column">
          <p className="staffFooter__heading">Resources</p>
          <p className="staffFooter__item">Daily Checklist</p>
          <p className="staffFooter__item">Team Notes</p>
          <p className="staffFooter__item">Policy & Hygiene</p>
          <p className="staffFooter__item">Training Guides</p>
        </div>

        <div className="staffFooter__column">
          <p className="staffFooter__heading">Support</p>
          <p className="staffFooter__item">Manager Contact</p>
          <p className="staffFooter__item">Incident Escalation</p>
          <p className="staffFooter__item">System Status</p>
          <p className="staffFooter__item">Internal Help Desk</p>
        </div>
      </div>
    </footer>
  );
}
