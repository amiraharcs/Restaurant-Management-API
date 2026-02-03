package uk.ac.rhul.teamproject36.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot application class for the Oaxaca Backend.
 */
@SpringBootApplication
public final class OaxacaBackendApplication {

    /**
     * Private constructor to prevent instantiation.
     */
    private OaxacaBackendApplication() {
    }

    /**
     * Main entry point for the Spring Boot application.
     *
     * @param args command line arguments
     */
    public static void main(final String[] args) {
        SpringApplication.run(OaxacaBackendApplication.class, args);
    }

}
