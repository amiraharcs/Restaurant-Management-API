package uk.ac.rhul.teamproject36.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import static org.junit.jupiter.api.Assertions.*;

class WebconfigTest {

    @Test
    void testAddCorsMappingsDoesNotCrash() {
        Webconfig config = new Webconfig();

        CorsRegistry registry = new CorsRegistry();

        config.addCorsMappings(registry);

        assertNotNull(registry);
    }
}