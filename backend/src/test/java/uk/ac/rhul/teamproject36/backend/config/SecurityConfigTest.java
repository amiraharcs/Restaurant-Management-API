package uk.ac.rhul.teamproject36.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class SecurityConfigTest {

    @Test
    void testPasswordEncoder() {
        SecurityConfig config = new SecurityConfig();

        PasswordEncoder encoder = config.passwordEncoder();

        assertNotNull(encoder);
        assertTrue(encoder.matches("test", encoder.encode("test")));
    }

    @Test
    void testCorsConfigurationSource() {
        SecurityConfig config = new SecurityConfig();

        assertNotNull(config.corsConfigurationSource());
    }
}