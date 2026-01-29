package uk.ac.rhul.teamproject36.Backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.Backend.service.HealthService;

@RestController
public class HealthController {
  private final HealthService healthService;

  public HealthController(HealthService healthService) {
    this.healthService = healthService;
  }

  @GetMapping("/api/health")
  public String health() {
    return healthService.getStatus();
  }
}
