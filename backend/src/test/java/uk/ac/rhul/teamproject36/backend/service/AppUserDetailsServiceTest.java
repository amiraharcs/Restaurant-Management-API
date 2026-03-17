package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppUserDetailsServiceTest {

    @Test
    void testLoadUserByUsernameFound() {
        AppUserRepository repo = mock(AppUserRepository.class);
        AppUserDetailsService service = new AppUserDetailsService(repo);

        AppUser user = new AppUser();
        user.setUsername("amir");
        user.setPasswordHash("hash123");
        user.setRole("WAITER");
        user.setActive(true);

        when(repo.findByUsername("amir")).thenReturn(Optional.of(user));

        UserDetails result = service.loadUserByUsername("amir");

        assertEquals("amir", result.getUsername());
        assertEquals("hash123", result.getPassword());
        assertFalse(result.getAuthorities().isEmpty());
    }

    @Test
    void testLoadUserByUsernameNotFound() {
        AppUserRepository repo = mock(AppUserRepository.class);
        AppUserDetailsService service = new AppUserDetailsService(repo);

        when(repo.findByUsername("missing")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> service.loadUserByUsername("missing"));
    }
}