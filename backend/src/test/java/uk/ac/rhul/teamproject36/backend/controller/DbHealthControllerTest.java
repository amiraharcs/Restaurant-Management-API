package uk.ac.rhul.teamproject36.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DbHealthControllerTest {

    @Test
    void dbHealthReturnsUp() {
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        DbHealthController controller = new DbHealthController(jdbcTemplate);

        when(jdbcTemplate.queryForObject("SELECT 1", Integer.class)).thenReturn(1);

        Map<String, Object> result = controller.dbHealth();

        assertEquals("up", result.get("db"));
        assertEquals(1, result.get("check"));
        verify(jdbcTemplate).queryForObject("SELECT 1", Integer.class);
    }
}