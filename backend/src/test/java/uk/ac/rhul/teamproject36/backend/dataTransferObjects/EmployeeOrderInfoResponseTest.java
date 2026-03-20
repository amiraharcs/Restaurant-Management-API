package uk.ac.rhul.teamproject36.backend.dataTransferObjects;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.order.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeOrderInfoResponseTest {

    @Test
    void constructorAndGettersWork() {
        LocalDateTime now = LocalDateTime.now();

        EmployeeOrderInfoResponse dto =
                new EmployeeOrderInfoResponse(
                        OrderStatus.PLACED,
                        now,
                        3,
                        new BigDecimal("25.50"),
                        PaymentStatus.PAID
                );

        assertEquals(OrderStatus.PLACED, dto.getStatus());
        assertEquals(now, dto.getOrderDateTime());
        assertEquals(3, dto.getNumberOfItems());
        assertEquals(new BigDecimal("25.50"), dto.getOrderTotal());
    }

    @Test
    void settersWork() {
        EmployeeOrderInfoResponse dto = new EmployeeOrderInfoResponse();

        dto.setStatus(OrderStatus.DELIVERED);
        dto.setOrderDateTime(LocalDateTime.now());
        dto.setNumberOfItems(5);
        dto.setOrderTotal(new BigDecimal("100.00"));

        assertEquals(OrderStatus.DELIVERED, dto.getStatus());
        assertEquals(5, dto.getNumberOfItems());
        assertEquals(new BigDecimal("100.00"), dto.getOrderTotal());
    }
}