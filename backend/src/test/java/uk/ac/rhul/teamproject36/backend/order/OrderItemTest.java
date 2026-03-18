package uk.ac.rhul.teamproject36.backend.order;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class OrderItemTest {

    @Test
    void testSettersAndGetters() {
        OrderItem item = new OrderItem();
        CustomerOrder order = new CustomerOrder();

        item.setOrder(order);
        item.setQuantity(3);

        assertEquals(order, item.getOrder());
        assertEquals(3, item.getQuantity());
    }
}