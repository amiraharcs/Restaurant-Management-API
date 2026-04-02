import { SiTicktick } from "react-icons/si";
import type { EmployeeDataResponse } from "../../api/managerApi";
import { GiCancel } from "react-icons/gi";

export default function EmployeeDetail({setShowDetail, employee} : {setShowDetail: any; employee: EmployeeDataResponse;}) {
    
// Status has a specific colour, mapping for order badges
const status_styles = {
  PLACED: "#93C5FD",
  CONFIRMED: "#A5B4FC",
  PREPARING: "#FCD34D",
  READY: "#6EE7B7",
  DELIVERED: "#7DD3FC",
  CANCELLED: "#FCA5A5"
};

    return (
         <div className="employee_detail_main">
          <div className="employee_detail_main_backdrop" onClick={() => setShowDetail(false)}></div>
          <div className="employee_detail_main_content">
            <button
              className="employee_detail_main_close"
              onClick={() => {
                setShowDetail(false);
              }}
            >
              x
            </button>
            <div className="employee_detail_header">
                <h3 className="employee_detail_title">{employee.username}</h3>
            </div>
            {/* Shift + active status */}
            <div className="employee_detail_header_box">
                    <span className="employee_detail_header_box_span">
                        <p>On Shift</p>
                        {employee.onShift ? <SiTicktick className="employee_tick"/> : <GiCancel className="employee_cross"/>}
                    </span>
                    <span className="employee_detail_header_box_span">
                        <p>Active</p>
                        {employee.active ? <SiTicktick className="employee_tick"/> : <GiCancel className="employee_cross"/>}
                    </span>
            </div>
            
            {/* Basic employee info */}
            <div className="employee_detail_info">
                <div className="employee_detail_info_row">
                    <span className="employee_detail_info_label">Employee ID</span>
                    <span className="employee_detail_info_value">{employee.employeeId}</span>
                </div>
                <div className="employee_detail_info_row">
                    <span className="employee_detail_info_label">Username</span>
                    <span className="employee_detail_info_value">{employee.username}</span>
                </div>
                <div className="employee_detail_info_row">
                    <span className="employee_detail_info_label">Role</span>
                    <span className="employee_detail_info_value">{employee.role}</span>
                </div>
            </div>

              {/* Employee Stats */}
             <div className="employee_detail_stats">
                <div className="employee_detail_stat_card">
                    <p className="employee_detail_stat_label">Total Sales</p>
                    <p className="employee_detail_stat_value">£{Number(employee.totalSales).toFixed(2)}</p>
                </div>

                <div className="employee_detail_stat_card">
                    <p className="employee_detail_stat_label">Total Orders</p>
                    <p className="employee_detail_stat_value">{employee.totalOrders}</p>
                </div>

                <div className="employee_detail_stat_card">
                    <p className="employee_detail_stat_label">Items Sold</p>
                    <p className="employee_detail_stat_value">{employee.totalItemsSold}</p>
                </div>
            </div>
            <p className="employee_detail_stat_notice">* The stats are all time</p>

            {/* Orders list */}
            <div className="employee_detail_orders_section">
                <h3 className="employee_detail_orders_title">Recent Orders</h3>

                {employee.employeeOrders.length === 0 ? (
                    <p className="employee_detail_no_orders">No orders found for this employee.</p>
                ) : (
                    <div className="employee_detail_orders_list">
                        {employee.employeeOrders.map( (order, number) => (
                            <div className="employee_detail_order" key={number}>
                                {/* Order total */}
                                <div>
                                    <span className="employee_detail_order_total">
                                        <p>Total:</p>
                                        <p className="employee_detail_order_price">£{order.orderTotal}</p>
                                    </span>

                                {/* Items + date */}
                                <div className="employee_detail_order_items_date">
                                    <span className="employee_detail_order_items">
                                        {order.numberOfItems} item{order.numberOfItems !== 1 ? "s" : ""}
                                    </span>
                                    <span className="employee_detail_order_dot">●</span>
                                    <span className="employee_detail_order_date">
                                        {new Date(order.orderDateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        {" "}•{" "}
                                        {new Date(order.orderDateTime).toLocaleDateString()}
                                    </span>
                                </div>
                                </div>

                                {/* Status badge */}
                                <div className="employee_detail_order_status">
                                    <p className="employee_detail_order_status_text" style={{backgroundColor: status_styles[order.status]}}>{order.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
    )
}