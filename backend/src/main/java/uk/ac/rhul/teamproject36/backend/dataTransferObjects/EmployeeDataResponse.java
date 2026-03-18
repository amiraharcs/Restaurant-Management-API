package uk.ac.rhul.teamproject36.backend.dataTransferObjects;

import java.math.BigDecimal;
import java.util.List;

public class EmployeeDataResponse {
    private Long employeeId;
    private String username;
    private String role;
    private Boolean isActive;
    private Boolean onShift;

    private BigDecimal totalSales;
    private Integer totalOrders;
    private Integer totalItemsSold;

    private List<EmployeeOrderInfoResponse> employeeOrders;

    public EmployeeDataResponse() {
    }

    public EmployeeDataResponse(Long employeeId, String username, String role, boolean isActive, boolean onShift, BigDecimal totalSales, Integer totalOrders, Integer totalItemsSold, List<EmployeeOrderInfoResponse> employeeOrders) {
        this.employeeId = employeeId;
        this.username = username;
        this.role = role;
        this.isActive = isActive;
        this.onShift = onShift;
        this.employeeOrders = employeeOrders;
        this.totalSales = totalSales;
        this.totalOrders = totalOrders;
        this.totalItemsSold = totalItemsSold;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Boolean getOnShift() {
        return onShift;
    }

    public void setOnShift(Boolean onShift) {
        this.onShift = onShift;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Integer getTotalItemsSold() {
        return totalItemsSold;
    }

    public void setTotalItemsSold(Integer totalItemsSold) {
        this.totalItemsSold = totalItemsSold;
    }

    public List<EmployeeOrderInfoResponse> getEmployeeOrders() {
        return employeeOrders;
    }

    public void setEmployeeOrders(List<EmployeeOrderInfoResponse> employeeOrders) {
        this.employeeOrders = employeeOrders;
    }
}
