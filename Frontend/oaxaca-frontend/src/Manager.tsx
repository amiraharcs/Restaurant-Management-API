import NavBarManager from "./data/components/NavBarManager";
import StaffWelcome from "./data/components/StaffWelcome";
import "./css/Manager.css"
import { useEffect, useState } from "react";
import { fetchEmployeeData, type EmployeeDataResponse } from "./api/managerApi";
import EmployeeDetail from "./data/components/EmployeeDetail";
import { SiTicktick } from "react-icons/si";
import { GiCancel } from "react-icons/gi";

export default function Manager() {

    //Staff tabs shown on the page
    type employee = "WAITER" | "KITCHEN"

    const [activeTab, setActiveTab] = useState<employee>("WAITER")

    //API state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [employees, setEmployees] = useState<EmployeeDataResponse[]>([]);

    //Employee detail popup state
    const [showDetail, setShowDetail] = useState<boolean>(false)
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDataResponse | null>(null);

    //Time filter for waiter stats
    const [employeeDataTimeFrame, setEmployeeDataTimeFrame] = useState<string>("today");

    // Fetch employee data on load and refresh every 5 seconds
    useEffect(() => {
            async function loadEmployeeData() {
              try {
                setLoading(true);
                setError("");
                const data = await fetchEmployeeData()
                setEmployees(data)
              } catch (e: any) {
                  setError(e?.message ?? "Failed to load employee data")
              } finally {
                  setLoading(false)
              }
            }
        loadEmployeeData();
        const id = setInterval(loadEmployeeData, 5000);
        return () => clearInterval(id);
    }, []);

    // Filter employee orders by selected time frame
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

            return false;
        })

    }    

    // Calculate stats for a waiter
    function getEmployeeStats(employee: EmployeeDataResponse) {
        const filteredOrders = getFilteredOrders(employee)

        const totalSales = filteredOrders
        .filter(order => order.paymentStatus == "PAID")
        .reduce((sum, order) => sum + Number(order.orderTotal), 0);


        const totalItemsSold = filteredOrders
        .filter(order => order.paymentStatus === "PAID")
        .reduce((sum, order) => sum + Number(order.numberOfItems), 0)

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
                        <button className={`employee_Tab ${activeTab === "WAITER" ? `active` : ``}`} onClick={() => setActiveTab("WAITER")}>Waiter Staff</button>
                        <button className={`employee_Tab ${activeTab === "KITCHEN" ? `active` : ``}`} onClick={() => setActiveTab("KITCHEN")}>Kitchen Staff</button>
                    </div>
                    <div className='employee_Title'>
                        <h2>{activeTab} STAFF</h2>
                    </div>

                    <hr />

                   <div className="employee_main">
                    {/* Time frame filter only shown for waiters */}
                       {activeTab === "WAITER" &&<div className="employee-filter">
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
                        </div>}

                        {/* Loading state */}
                        {loading && <div className="employee_data"> 
                            <p>Loading employee data</p>    
                        </div>}

                        {/* Error state */}
                        {error && <div className="employee_data"> 
                            <p>{error}</p>    
                        </div>}

                        {/* Employee boxes */}
                        {!loading && <div className="employee_data">
                            {employees.filter((employee) => employee.role === activeTab)
                            .map( (employee) =>  {
                                const isWaiter = employee.role === "WAITER";
                                const stats = getEmployeeStats(employee);
                                return (
                                //green sidebar if employee is onshift and red sidebar if employee is not on shift
                                <div className={`employee_individual ${employee.onShift ? `OnShift` : `notOnShift`}`} key={employee.employeeId}
                                onClick={
                                    isWaiter
                                    ? () => {
                                        setSelectedEmployee(employee);
                                        setShowDetail(true);
                                        }
                                    : undefined
                                }
                                style={{ cursor: isWaiter ? "pointer" : "default" }}
                                >
                                    <div className="employee_username">
                                        <p>{employee.username}</p>
                                    </div>
                                     {isWaiter ? (
                                        <>
                                        <div className="employee_total_sales employee_stats">
                                            <p className="employee_stats_p">Total Sales</p>
                                            <p className="employee_stat_text">£{stats.totalSales.toFixed(2)}</p>
                                        </div>
                                        <div className="employee_total_items employee_stats">
                                            <p className="employee_stats_p">Total Items Sold</p>
                                            <p className="employee_stat_text">{stats.totalItemsSold}</p>
                                        </div>
                                        <div className="employee_total_orders employee_stats">
                                            <p className="employee_stats_p">Total Orders</p>
                                            <p className="employee_stat_text">{stats.totalOrders}</p>
                                        </div>
                                        </>
                                    ) : (
                                        <>
                                        <div className="employee_total_orders employee_stats">
                                            <p className="employee_stats_p">Employee ID</p>
                                            <p className="employee_stat_text">{employee.employeeId}</p>
                                        </div>
                                         <div className="employee_total_sales employee_stats">
                                            <p className="employee_stats_p">Role</p>
                                            <p className="employee_stat_text">{employee.role}</p>
                                        </div>
                                        <div className="employee_total_items employee_stats">
                                            <p className="employee_stats_p">Active</p>
                                            {employee.active ? <SiTicktick className="employee_tick_main"/> : <GiCancel className="employee_cross_main"/>}
                                        </div>
                                        </>
                                    )}
                                </div>
                            )})}
                        </div>}
                   </div>
                </div>
            </div>

            {/* Employee detail popup */}
            {showDetail && selectedEmployee && (
                <EmployeeDetail
                    setShowDetail={setShowDetail}
                    employee={selectedEmployee}
                />
            )}
            
        </main>
    )
}