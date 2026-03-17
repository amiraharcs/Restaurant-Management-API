package uk.ac.rhul.teamproject36.backend.alert;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class CallWaiterAlertTest {

    @Test
    void testGettersAndSetters() {
        CallWaiterAlert alert = new CallWaiterAlert();

        alert.setTableNumber(5);
        alert.setCustomerName("Amir");
        alert.setMessage("Need help");
        alert.setHandled(true);

        assertEquals(5, alert.getTableNumber());
        assertEquals("Amir", alert.getCustomerName());
        assertEquals("Need help", alert.getMessage());
        assertTrue(alert.isHandled());
    }

    @Test
    void testPrePersistSetsCreatedAt() {
        CallWaiterAlert alert = new CallWaiterAlert();

        alert.prePersist();

        assertNotNull(alert.getCreatedAt());
        assertTrue(alert.getCreatedAt().isBefore(Instant.now().plusSeconds(1)));
    }
}