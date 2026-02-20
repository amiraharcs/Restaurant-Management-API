package uk.ac.rhul.teamproject36.backend.auth;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entity representing an authenticated application user.
 */
@Entity
@Table(name = "app_user")
public final class AppUser {

  /** Primary key of the user row. */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long userId;

  /** Unique login username. */
  @Column(name = "username", nullable = false, unique = true)
  private String username;

  /** Unique email address. */
  @Column(name = "email", nullable = false, unique = true)
  private String email;

  /** BCrypt password hash stored in DB. */
  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  /** Business role, e.g. WAITER or KITCHEN. */
  @Column(name = "role", nullable = false)
  private String role;

  /** Whether user is allowed to authenticate. */
  @Column(name = "is_active", nullable = false)
  private boolean active;

  public Long getUserId() {
    return userId;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(final String newUsername) {
    this.username = newUsername;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(final String newEmail) {
    this.email = newEmail;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(final String newPasswordHash) {
    this.passwordHash = newPasswordHash;
  }

  public String getRole() {
    return role;
  }

  public void setRole(final String newRole) {
    this.role = newRole;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(final boolean isUserActive) {
    this.active = isUserActive;
  }
}