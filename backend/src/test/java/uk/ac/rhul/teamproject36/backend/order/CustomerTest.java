package uk.ac.rhul.teamproject36.backend.order;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

class CustomerTest {

    @Test
    void testGettersAndSetters() {
        Customer customer = new Customer();

        customer.setId(1L);
        customer.setName("John");
        customer.setPhoneNumber("123456");

        assertEquals(1L, customer.getId());
        assertEquals("John", customer.getName());
        assertEquals("123456", customer.getPhoneNumber());

        customer.setOrders(new ArrayList<>());
        assertNotNull(customer.getOrders());
    }
}