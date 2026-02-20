package uk.ac.rhul.teamproject36.backend.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;

/**
 * User details service loading login users from app_user table.
 */
@Service
public class AppUserDetailsService implements UserDetailsService {

  private final AppUserRepository appUserRepository;

  public AppUserDetailsService(final AppUserRepository appUserRepository) {
    this.appUserRepository = appUserRepository;
  }

  @Override
  public UserDetails loadUserByUsername(final String username)
      throws UsernameNotFoundException {

    final AppUser appUser = appUserRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    final String role = appUser.getRole() == null ? "" : appUser.getRole().trim().toUpperCase();
    final String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;

    return User.withUsername(appUser.getUsername())
        .password(appUser.getPasswordHash())
        .authorities(authority)
        .disabled(!appUser.isActive())
        .build();
  }
}