import NavBarManager from "./data/components/NavBarManager";
import StaffWelcome from "./data/components/StaffWelcome";
import "./css/Manager.css"
import { useEffect, useState } from "react";
import { fetchEmployeeData } from "./api/managerApi";

export default function Manager() {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
              async function loadEmployeeData() {
              try {
      
                setLoading(true);
              setError("");
                  const data = await fetchEmployeeData()
                  console.log(data)
              } catch (e: any) {
                  setError(e?.message ?? "Failed to load menu")
              } finally {
                  setLoading(false)
              }
          }
          loadEmployeeData()
          }, []);

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