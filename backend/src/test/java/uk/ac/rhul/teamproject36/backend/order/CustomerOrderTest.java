package uk.ac.rhul.teamproject36.backend.order;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CustomerOrderTest {

    @Test
    void testDefaultsAndSetters() {
        CustomerOrder order = new CustomerOrder();

        assertEquals(OrderStatus.PLACED, order.getStatus());
        assertEquals(PaymentStatus.UNPAID, order.getPaymentStatus());

        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setTableNumber(5);

        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
        assertEquals(PaymentStatus.PAID, order.getPaymentStatus());
        assertEquals(5, order.getTableNumber());
    }

    @Test
    void testAddItem() {
        CustomerOrder order = new CustomerOrder();
        OrderItem item = new OrderItem();

        order.addItem(item);

        assertEquals(1, order.getItems().size());
        assertEquals(order, item.getOrder());
    }
}