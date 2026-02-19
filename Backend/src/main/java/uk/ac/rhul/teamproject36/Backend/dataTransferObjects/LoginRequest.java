package uk.ac.rhul.teamproject36.Backend.dataTransferObjects;

/**
 * Data Transfer Object (DTO) for a login request.
 *
 * Contains the credentials to be authenticated.
 * By the {@code POST /api/auth/login}.
 */
public final class LoginRequest {

  /** The user's user-name. */
  private String username;

  /** The user's password. */
  private String password;

  /**
   * Default constructor.
   */
  public LoginRequest() {

  }

  /**
   * Returns user-name for login request.
   *
   * @return the user-name
   */
  public String getUsername() {
    return username;
  }

  /**
   * Sets the user-name for login request.
   *
   * @param newUsername the new user-name
   */
  public void setUsername(final String newUsername) {
    this.username = newUsername;
  }

  /**
   * Returns password for login request.
   *
   * @return the password
   */
  public String getPassword() {
    return password;
  }

  /**
   * Sets the password for login request.
   *
   * @param newPassword the new password
   */
  public void setPassword(final String newPassword) {
    this.password = newPassword;
  }
}
