import "../../css/NavBarWaiter.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LuBell, LuUserRound } from "react-icons/lu";

export default function NavBarWaiter() {
    let navigate = useNavigate();

    // dummy number for bell notifications
    const bellNoti = 2;

    function toAccount() {
        navigate("/waiter");
    }

    return (
        <main>
            <nav className="navbar">
                <NavLink to="/waiter">Orders</NavLink>

                <div className="requestDropdownWrap">
                    <NavLink to="/alerts">Alerts</NavLink>
                </div>

                <NavLink to="/" end>Logout</NavLink>

                <div className="navRight">
                    <button type="button" className="rightIconsButton">
                        <LuBell className="rightIcons"/>
                        {bellNoti > 0 && <span className="redBadge" />}
                    </button>

                    <button type="button" className="rightIconsButton" onClick={toAccount}>
                        <LuUserRound className="rightIcons"/>
                    </button>
                </div>
            </nav>
        </main>
    );
}