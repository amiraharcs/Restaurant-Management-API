package uk.ac.rhul.teamproject36.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.filter.CorsFilter;

import static org.junit.jupiter.api.Assertions.*;

class CorsConfigTest {

    @Test
    void testCorsFilterNotNull() {
        CorsConfig config = new CorsConfig();

        CorsFilter filter = config.corsFilter();

        assertNotNull(filter);
    }
}