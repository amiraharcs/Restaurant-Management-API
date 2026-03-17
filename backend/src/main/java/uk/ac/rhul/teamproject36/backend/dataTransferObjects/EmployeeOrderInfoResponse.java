package uk.ac.rhul.teamproject36.backend.dataTransferObjects;


import uk.ac.rhul.teamproject36.backend.order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EmployeeOrderInfoResponse {

    private BigDecimal orderTotal;
    private Integer numberOfItems;
    private LocalDateTime orderDateTime;
    private OrderStatus status;

    public EmployeeOrderInfoResponse(OrderStatus status, LocalDateTime orderDateTime, Integer numberOfItems, BigDecimal orderTotal) {
        this.status = status;
        this.orderDateTime = orderDateTime;
        this.numberOfItems = numberOfItems;
        this.orderTotal = orderTotal;
    }

    public BigDecimal getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(BigDecimal orderTotal) {
        this.orderTotal = orderTotal;
    }

    public Integer getNumberOfItems() {
        return numberOfItems;
    }

    public void setNumberOfItems(Integer numberOfItems) {
        this.numberOfItems = numberOfItems;
    }

    public LocalDateTime getOrderDateTime() {
        return orderDateTime;
    }

    public void setOrderDateTime(LocalDateTime orderDateTime) {
        this.orderDateTime = orderDateTime;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
