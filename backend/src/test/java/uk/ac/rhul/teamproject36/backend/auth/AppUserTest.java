package uk.ac.rhul.teamproject36.backend.auth;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AppUserTest {

    @Test
    void testGettersAndSetters() {
        AppUser user = new AppUser();

        user.setUsername("amir");
        user.setEmail("amir@test.com");
        user.setPasswordHash("hash");
        user.setRole("WAITER");
        user.setActive(true);
        user.setOnShift(true);

        assertNull(user.getUserId());
        assertEquals("amir", user.getUsername());
        assertEquals("amir@test.com", user.getEmail());
        assertEquals("hash", user.getPasswordHash());
        assertEquals("WAITER", user.getRole());
        assertTrue(user.isActive());
        assertTrue(user.isOnShift());
    }

    @Test
    void testDefaultOnShiftIsFalse() {
        AppUser user = new AppUser();

        assertFalse(user.isOnShift());
    }
}