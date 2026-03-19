package uk.ac.rhul.teamproject36.backend.dataTransferObjects;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeDataResponseTest {

    @Test
    void constructorAndGettersWork() {
        EmployeeOrderInfoResponse order =
                new EmployeeOrderInfoResponse();

        EmployeeDataResponse dto =
                new EmployeeDataResponse(
                        1L,
                        "amir",
                        "WAITER",
                        true,
                        true,
                        new BigDecimal("200.00"),
                        10,
                        25,
                        List.of(order)
                );

        assertEquals(1L, dto.getEmployeeId());
        assertEquals("amir", dto.getUsername());
        assertEquals("WAITER", dto.getRole());
        assertTrue(dto.getActive());
        assertTrue(dto.getOnShift());
        assertEquals(new BigDecimal("200.00"), dto.getTotalSales());
        assertEquals(10, dto.getTotalOrders());
        assertEquals(25, dto.getTotalItemsSold());
        assertEquals(1, dto.getEmployeeOrders().size());
    }

    @Test
    void settersWork() {
        EmployeeDataResponse dto = new EmployeeDataResponse();

        dto.setEmployeeId(2L);
        dto.setUsername("john");
        dto.setRole("KITCHEN");
        dto.setActive(false);
        dto.setOnShift(true);
        dto.setTotalSales(new BigDecimal("50.00"));
        dto.setTotalOrders(5);
        dto.setTotalItemsSold(12);
        dto.setEmployeeOrders(List.of());

        assertEquals(2L, dto.getEmployeeId());
        assertEquals("john", dto.getUsername());
        assertEquals("KITCHEN", dto.getRole());
        assertFalse(dto.getActive());
        assertTrue(dto.getOnShift());
        assertEquals(new BigDecimal("50.00"), dto.getTotalSales());
        assertEquals(5, dto.getTotalOrders());
        assertEquals(12, dto.getTotalItemsSold());
    }
}