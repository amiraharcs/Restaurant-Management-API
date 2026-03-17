package uk.ac.rhul.teamproject36.backend.order;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CustomerOrderExtraTest {

    @Test
    void testCustomerAssignedWaiterAndCreatedAt() {
        CustomerOrder order = new CustomerOrder();
        Customer customer = new Customer();

        order.setCustomer(customer);
        assertEquals(customer, order.getCustomer());

        assertNotNull(order.getCreatedAt());
        assertNull(order.getAssignedWaiter());
    }
}