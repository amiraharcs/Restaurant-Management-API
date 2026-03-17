package uk.ac.rhul.teamproject36.backend.dataTransferObjects;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    @Test
    void testGettersAndSetters() {
        LoginRequest request = new LoginRequest();

        request.setUsername("amir");
        request.setPassword("secret");

        assertEquals("amir", request.getUsername());
        assertEquals("secret", request.getPassword());
    }
}