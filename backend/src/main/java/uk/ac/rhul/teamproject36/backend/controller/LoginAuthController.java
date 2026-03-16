package uk.ac.rhul.teamproject36.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.dataTransferObjects.LoginRequest;
import uk.ac.rhul.teamproject36.backend.dataTransferObjects.LoginResponse;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.service.AssignmentService;

/**
 * REST controller for user authentication. (replaces default http.basic())
 *
 * Exposes the end-point for client login and authentication.
 * Submits credentials and receives authenticated users.
 */
@RestController
@RequestMapping("/api/auth")
public class LoginAuthController {

  private final AuthenticationManager authManager;
  private final AppUserRepository userRepo;
  private final AssignmentService assignmentService;

  public LoginAuthController(AuthenticationManager newAuthManager,
      AppUserRepository userRepo, AssignmentService assignmentService) {
    this.authManager = newAuthManager;
    this.userRepo = userRepo;
    this.assignmentService = assignmentService;
  }

  /**
   * Authenticates users name and password. Accepts login credentials to authenticate user if
   * successful creates a login response.
   *
   * @param request the login request DTO with the users credentials.
   * @return a {@link ResponseEntity} for the login response DTO with the users name and role.
   */
  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    Authentication authentication = authManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()
            )
        );

    UserDetails user = (UserDetails) authentication.getPrincipal();

    String role = user.getAuthorities().iterator().next().getAuthority();
    if (role.startsWith("ROLE_")) {
      role = role.substring("ROLE_".length());
    }

    // Mark waiter as online, then try to pull from the buffer
    if ("WAITER".equals(role)) {
      userRepo.findByUsername(user.getUsername()).ifPresent(u -> {
        u.setOnShift(true);
        userRepo.save(u);
      });
      assignmentService.assignFromBuffer();
    }

    return ResponseEntity.ok(new LoginResponse(user.getUsername(), role));
  }

  /** Called when a waiter logs out — marks them offline. */
  @PostMapping("/logout/{username}")
  public ResponseEntity<Void> logout(@PathVariable String username) {
    userRepo.findByUsername(username).ifPresent((AppUser u) -> {
      u.setOnShift(false);
      userRepo.save(u);
    });
    return ResponseEntity.ok().build();
  }
}
