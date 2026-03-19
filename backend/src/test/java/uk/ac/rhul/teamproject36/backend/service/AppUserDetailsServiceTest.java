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
    void loadUserByUsername_foundActiveUserWithoutRolePrefix() {
        AppUserRepository repo = mock(AppUserRepository.class);
        AppUserDetailsService service = new AppUserDetailsService(repo);

        AppUser user = new AppUser();
        user.setUsername("amir");
        user.setPasswordHash("hash");
        user.setRole("waiter");
        user.setActive(true);

        when(repo.findByUsername("amir")).thenReturn(Optional.of(user));

        UserDetails result = service.loadUserByUsername("amir");

        assertEquals("amir", result.getUsername());
        assertEquals("hash", result.getPassword());
        assertTrue(result.isEnabled());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_WAITER")));
    }

    @Test
    void loadUserByUsername_foundDisabledUserWithRolePrefix() {
        AppUserRepository repo = mock(AppUserRepository.class);
        AppUserDetailsService service = new AppUserDetailsService(repo);

        AppUser user = new AppUser();
        user.setUsername("chef");
        user.setPasswordHash("hash2");
        user.setRole("ROLE_KITCHEN");
        user.setActive(false);

        when(repo.findByUsername("chef")).thenReturn(Optional.of(user));

        UserDetails result = service.loadUserByUsername("chef");

        assertEquals("chef", result.getUsername());
        assertFalse(result.isEnabled());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_KITCHEN")));
    }

    @Test
    void loadUserByUsername_notFound() {
        AppUserRepository repo = mock(AppUserRepository.class);
        AppUserDetailsService service = new AppUserDetailsService(repo);

        when(repo.findByUsername("missing")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> service.loadUserByUsername("missing"));
    }
    
    @Test
    void loadUserByUsername_nullRoleStillBuildsUser() {
        AppUserRepository repo = mock(AppUserRepository.class);
        AppUserDetailsService service = new AppUserDetailsService(repo);

        AppUser user = new AppUser();
        user.setUsername("norole");
        user.setPasswordHash("hash");
        user.setRole(null);
        user.setActive(true);

        when(repo.findByUsername("norole")).thenReturn(Optional.of(user));

        UserDetails result = service.loadUserByUsername("norole");

        assertEquals("norole", result.getUsername());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_")));
    }
}