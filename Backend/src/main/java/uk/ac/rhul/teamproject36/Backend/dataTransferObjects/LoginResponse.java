package uk.ac.rhul.teamproject36.Backend.dataTransferObjects;

/**
 * Data Transfer Object (DTO) for successful login response.
 *
 * This is returned to the client following a.
 * Successful login authentication.
 */
public final class LoginResponse {

  /** The authenticated user's user-name. */
  private final String username;

  /** The authenticated user's role. */
  private final String role;

  /**
   * Creates a login response.
   *
   * @param newUsername authenticated clients user-name
   * @param newRole clients role (STAFF or ADMIN)
   */
  public LoginResponse(final String newUsername, final String newRole) {
    this.username = newUsername;
    this.role = newRole;
  }

  /**
   * Authenticated clients user-name.
   *
   * @return the user-name
   */
  public String getUsername() {
    return username;
  }

  /**
   * Authenticated clients role.
   *
   * @return the role
   */
  public String getRole() {
    return role;
  }
}
