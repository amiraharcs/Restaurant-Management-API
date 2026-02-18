package uk.ac.rhul.teamproject36.backend.controller;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simple DB health endpoint.
 */
@RestController
public final class DbHealthController {

    private final JdbcTemplate jdbcTemplate;

    public DbHealthController(final JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/db-health")
    public Map<String, Object> dbHealth() {
        final Integer one = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
        return Map.of("db", "up", "check", one);
    }
}
