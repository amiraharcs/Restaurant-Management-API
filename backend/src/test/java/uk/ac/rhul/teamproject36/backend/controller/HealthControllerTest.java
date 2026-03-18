package uk.ac.rhul.teamproject36.backend.controller;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class HealthControllerTest {

    @Test
    void healthReturnsOk() {
        HealthController controller = new HealthController();

        Map<String, String> result = controller.health();

        assertEquals("ok", result.get("status"));
    }
}