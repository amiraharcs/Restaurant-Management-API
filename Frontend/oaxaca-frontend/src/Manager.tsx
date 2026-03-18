import NavBarManager from "./data/components/NavBarManager";
import StaffWelcome from "./data/components/StaffWelcome";
import "./css/Manager.css"
import { act, useEffect, useState } from "react";
import { fetchEmployeeData, type EmployeeDataResponse } from "./api/managerApi";

export default function Manager() {

    type employee = "WAITER" | "KITCHEN"

    const [activeTab, setActiveTab] = useState<employee>("WAITER")

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [employees, setEmployees] = useState<EmployeeDataResponse[]>([]);

    const [employeeDataTimeFrame, setEmployeeDataTimeFrame] = useState<string>("today");

    useEffect(() => {
              async function loadEmployeeData() {
              try {
                setLoading(true);
                setError("");
                const data = await fetchEmployeeData()
                console.log(data)
                setEmployees(data)
              } catch (e: any) {
                  setError(e?.message ?? "Failed to load menu")
              } finally {
                  setLoading(false)
              }
          }
          loadEmployeeData()
    }, []);

    function getFilteredOrders(employee: EmployeeDataResponse) {
        const now = new Date()

        return employee.employeeOrders.filter( (order) => {
            const orderDate = new Date(order.orderDateTime)

            if (employeeDataTimeFrame === "today") {
                return orderDate.getDate() === now.getDate() &&
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear();
            }

            if (employeeDataTimeFrame === "month") {
                return orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear()
                
            }

            if (employeeDataTimeFrame === "year") {
                return orderDate.getFullYear() === now.getFullYear()
            }

            if (employeeDataTimeFrame === "total") {
                return true;
            }

            console.log(orderDate)
            return false;
        })

    }    

    function getEmployeeStats(employee: EmployeeDataResponse) {
        const filteredOrders = getFilteredOrders(employee)

        const totalSales = filteredOrders.reduce(
        (sum, order) => sum + Number(order.orderTotal),0,
        );

        const totalItemsSold = filteredOrders.reduce(
            (sum, order) => sum + Number(order.numberOfItems), 0
        )

        const totalOrders = filteredOrders.length;

        return {totalSales, totalItemsSold, totalOrders};
    }

    return (
        <main>
            <NavBarManager />
            <div className="manager_page">
                <div className='manager_header'>
                    <StaffWelcome />
                </div>
                 <div className='employee_Container'>
                    <div className='employee_Tabs'>
                        <button className={`employee_Tab ${activeTab === "WAITER" ? `active` : ``}`} onClick={() => setActiveTab("WAITER")}>Employee Staff</button>
                        <button className={`employee_Tab ${activeTab === "KITCHEN" ? `active` : ``}`} onClick={() => setActiveTab("KITCHEN")}>Kitchen Staff</button>
                    </div>
                    <div className='employee_Title'>
                        <h2>{activeTab} STAFF</h2>
                    </div>

                    <hr />

                   <div className="employee_main">
                       <div className="employee-filter">
                            <label className="employee-filter_label" htmlFor="timeFrame">
                                Time Frame
                            </label>
                            <select
                                id="timeFrame"
                                className="employee-filter_select"
                                value={employeeDataTimeFrame}
                                onChange={(e) => setEmployeeDataTimeFrame(e.target.value)}
                            >
                                <option value="today">Today</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                                <option value="total">Total</option>
                            </select>
                        </div>
                        <div className="employee_data">
                            {employees.filter((employee) => employee.role === activeTab)
                            .map( (employee) =>  {
                                const stats = getEmployeeStats(employee);
                                return (
                                <div className={`employee_individual ${employee.onShift ? `OnShift` : `notOnShift`}`} key={employee.employeeId}>
                                    <div className="employee_username">
                                        <p>{employee.username}</p>
                                    </div>
                                    <div className="employee_total_sales">
                                        <p>Total Sales</p>
                                        <p className="employee_stat_text">£{stats.totalSales.toFixed(2)}</p>
                                    </div>
                                    <div className="employee_total_items">
                                        <p>Total Items Sold:</p>
                                        <p className="employee_stat_text">{stats.totalItemsSold}</p>
                                    </div>
                                    <div className="employee_total_orders">
                                        <p>Total Orders:</p>
                                        <p className="employee_stat_text">{stats.totalOrders}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                   </div>
                </div>
            </div>
            
        </main>
    )
}