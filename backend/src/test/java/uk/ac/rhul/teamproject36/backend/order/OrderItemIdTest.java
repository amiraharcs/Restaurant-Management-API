package uk.ac.rhul.teamproject36.backend.order;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OrderItemIdTest {

    @Test
    void testEqualsAndHashCode() {
        OrderItemId id1 = new OrderItemId(1L, 2L);
        OrderItemId id2 = new OrderItemId(1L, 2L);
        OrderItemId id3 = new OrderItemId(2L, 3L);

        assertEquals(id1, id2);
        assertEquals(id1.hashCode(), id2.hashCode());

        assertNotEquals(id1, id3);
    }
}