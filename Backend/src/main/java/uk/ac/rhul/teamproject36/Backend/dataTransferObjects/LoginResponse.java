package uk.ac.rhul.teamprojects36.backend.dataTransferObjects;

public final class LoginResponse {
  
  private final String username;
  private final String role;
  
  public LoginResponse(final String username, final String role) {
    this.username = username;
    this.role = role;
  }
  
  public String getUsername() {
    return username;
  }
  
  public String getRole() {
    return role;
  }
}