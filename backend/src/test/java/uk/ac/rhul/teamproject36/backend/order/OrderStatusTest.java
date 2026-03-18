package uk.ac.rhul.teamproject36.backend.order;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OrderStatusTest {

    @Test
    void testEnumValues() {
        assertEquals(OrderStatus.PLACED, OrderStatus.valueOf("PLACED"));
        assertTrue(OrderStatus.values().length > 0);
    }
}