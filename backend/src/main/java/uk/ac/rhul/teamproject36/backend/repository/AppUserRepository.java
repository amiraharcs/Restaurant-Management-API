package uk.ac.rhul.teamproject36.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;

/**
 * Repository for authenticated users.
 */
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

  /**
   * Finds a user by username.
   *
   * @param username login username
   * @return optional user
   */
  Optional<AppUser> findByUsername(String username);

  // Waiters currently on shift
  List<AppUser> findByRoleAndOnShiftTrue(String role);
}