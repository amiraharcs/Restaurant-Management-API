package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppUserDataSeederTest {

    @Test
    void run_skipsWhenDisabled() throws Exception {
        AppUserRepository repo = mock(AppUserRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        Environment env = mock(Environment.class);

        when(env.getProperty("APP_SEED_USERS", "true")).thenReturn("false");

        AppUserDataSeeder seeder = new AppUserDataSeeder(repo, encoder, env);
        seeder.run();

        verify(repo, never()).save(any());
        verify(encoder, never()).encode(anyString());
    }

    @Test
    void run_upsertsAllUsersWhenEnabled() throws Exception {
        AppUserRepository repo = mock(AppUserRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        Environment env = mock(Environment.class);

        when(env.getProperty("APP_SEED_USERS", "true")).thenReturn("true");
        when(env.getProperty("APP_DEV_USER_PASSWORD", "Passw0rd!")).thenReturn("secret");
        when(repo.findByUsername(anyString())).thenReturn(Optional.empty());
        when(encoder.encode("secret")).thenReturn("encoded-secret");
        when(repo.save(any(AppUser.class))).thenAnswer(inv -> inv.getArgument(0));

        AppUserDataSeeder seeder = new AppUserDataSeeder(repo, encoder, env);
        seeder.run();

        verify(repo, times(6)).save(any(AppUser.class));
        verify(encoder, times(6)).encode("secret");
    }
}