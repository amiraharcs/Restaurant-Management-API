package uk.ac.rhul.teamproject36.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;

/**
 * Seeds development login users on startup.
 */
@Component
public class AppUserDataSeeder implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(AppUserDataSeeder.class);

  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;
  private final Environment environment;

  public AppUserDataSeeder(final AppUserRepository appUserRepository,
                           final PasswordEncoder passwordEncoder,
                           final Environment environment) {
    this.appUserRepository = appUserRepository;
    this.passwordEncoder = passwordEncoder;
    this.environment = environment;
  }

  @Override
  @Transactional
  public void run(final String... args) {
    final boolean seedUsers = Boolean.parseBoolean(environment.getProperty("APP_SEED_USERS", "true"));
    if (!seedUsers) {
      log.info("APP_SEED_USERS=false -> skipping app_user seeding");
      return;
    }

    final String devPassword = environment.getProperty("APP_DEV_USER_PASSWORD", "Passw0rd!");
    upsertUser("waiter01", "waiter01@oaxaca.local", devPassword, "WAITER");
    upsertUser("kitchen01", "kitchen01@oaxaca.local", devPassword, "KITCHEN");
  }

  private void upsertUser(final String username,
                          final String email,
                          final String plainPassword,
                          final String role) {
    final AppUser user = appUserRepository.findByUsername(username).orElseGet(AppUser::new);
    user.setUsername(username);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(plainPassword));
    user.setRole(role);
    user.setActive(true);
    appUserRepository.save(user);
  }
}