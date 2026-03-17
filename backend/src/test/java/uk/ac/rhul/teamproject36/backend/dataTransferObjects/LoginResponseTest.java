package uk.ac.rhul.teamproject36.backend.dataTransferObjects;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginResponseTest {

    @Test
    void testConstructorAndGetters() {
        LoginResponse response = new LoginResponse("amir", "WAITER");

        assertEquals("amir", response.getUsername());
        assertEquals("WAITER", response.getRole());
    }
}