package uk.ac.rhul.teamproject36.backend.order;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PaymentStatusTest {

    @Test
    void testEnumValues() {
        assertEquals(PaymentStatus.PAID, PaymentStatus.valueOf("PAID"));
        assertTrue(PaymentStatus.values().length > 0);
    }
}