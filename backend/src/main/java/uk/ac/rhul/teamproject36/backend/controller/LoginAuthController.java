package uk.ac.rhul.teamproject36.Backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.Backend.dataTransferObjects.LoginRequest;
import uk.ac.rhul.teamproject36.Backend.dataTransferObjects.LoginResponse;

/**
 * REST controller for user authentication. (replaces default http.basic())
 *
 * Exposes the end-point for client login and authentication.
 * Submits credentials and receives authenticated users.
 */
@RestController
@RequestMapping("/api/auth")
public class LoginAuthController {

  /** The authentication manager for validation. */
  private final AuthenticationManager authManager;

  /**
   * Constructor for authentication controller.
   *
   * @param newAuthManager validates user credentials.
   */
  public LoginAuthController(AuthenticationManager newAuthManager) {
    this.authManager = newAuthManager;
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

    return ResponseEntity.ok(new LoginResponse(user.getUsername(), role));
  }
}
