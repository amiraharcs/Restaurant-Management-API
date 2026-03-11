import NavBarManager from "./data/components/NavBarManager";
import StaffWelcome from "./data/components/StaffWelcome";
import "./css/Manager.css"

export default function Manager() {
    return (
        <main>
            <NavBarManager />
            <div className="manager_page">
                <div className='manager_header'>
                    <StaffWelcome />
                </div>
                <p>This is the manager home page</p>
            </div>
            
        </main>
    )
}