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


@RestController
@RequestMapping("/api/auth")
public class LoginAuthController{
  private final AuthenticationManager authManager;
  
  public LoginAuthController(AuthenticationManager authManager) {
    this.authManager = authManager;
  }
  
  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    Authentication authentication = authManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
  
    UserDetails user = (UserDetails) authentication.getPrincipal();
    
    String role = user.getAuthorities().iterator().next().getAuthority();
    
    return ResponseEntity.ok(new LoginResponse(user.getUsername(), role));
  }
}