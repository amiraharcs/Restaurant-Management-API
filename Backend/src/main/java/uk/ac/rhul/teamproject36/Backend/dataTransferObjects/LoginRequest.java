package uk.ac.rhul.teamproject36.Backend.dataTransferObjects;

public final class LoginRequest {
  
  private String username;
  private String password;
  
  public LoginRequest() {
    
  }
  
  public String getUsername() {
    return this.username;
  }
  
  public void setUsername(final String username) {
    this.username = username;
  }
  
  public String getPassword() {
    return password;
  }
  
  public void setPassword(final String password) {
    this.password = password;
  }
}