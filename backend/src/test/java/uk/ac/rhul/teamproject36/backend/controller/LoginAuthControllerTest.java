package uk.ac.rhul.teamproject36.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.dataTransferObjects.LoginRequest;
import uk.ac.rhul.teamproject36.backend.dataTransferObjects.LoginResponse;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.service.AssignmentService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LoginAuthControllerTest {

    @Test
    void loginWaiterMarksOnShiftAndAssignsBuffer() {
        AuthenticationManager authManager = mock(AuthenticationManager.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        LoginAuthController controller =
                new LoginAuthController(authManager, userRepo, assignmentService);

        LoginRequest request = new LoginRequest();
        request.setUsername("amir");
        request.setPassword("secret");

        User principal = User.withUsername("amir")
                .password("ignored")
                .roles("WAITER")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(authManager.authenticate(any())).thenReturn(authentication);

        AppUser user = new AppUser();
        user.setUsername("amir");
        when(userRepo.findByUsername("amir")).thenReturn(Optional.of(user));
        when(userRepo.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<LoginResponse> response = controller.login(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("amir", response.getBody().getUsername());
        assertEquals("WAITER", response.getBody().getRole());
        assertTrue(user.isOnShift());

        verify(userRepo).save(user);
        verify(assignmentService).assignFromBuffer();
    }

    @Test
    void loginNonWaiterDoesNotAssignBuffer() {
        AuthenticationManager authManager = mock(AuthenticationManager.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        LoginAuthController controller =
                new LoginAuthController(authManager, userRepo, assignmentService);

        LoginRequest request = new LoginRequest();
        request.setUsername("chef");
        request.setPassword("secret");

        User principal = User.withUsername("chef")
                .password("ignored")
                .roles("KITCHEN")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(authManager.authenticate(any())).thenReturn(authentication);

        ResponseEntity<LoginResponse> response = controller.login(request);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("chef", response.getBody().getUsername());
        assertEquals("KITCHEN", response.getBody().getRole());

        verify(userRepo, never()).save(any());
        verify(assignmentService, never()).assignFromBuffer();
    }

    @Test
    void logoutMarksUserOffShiftWhenPresent() {
        AuthenticationManager authManager = mock(AuthenticationManager.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        LoginAuthController controller =
                new LoginAuthController(authManager, userRepo, assignmentService);

        AppUser user = new AppUser();
        user.setUsername("amir");
        user.setOnShift(true);

        when(userRepo.findByUsername("amir")).thenReturn(Optional.of(user));
        when(userRepo.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<Void> response = controller.logout("amir");

        assertEquals(200, response.getStatusCode().value());
        assertFalse(user.isOnShift());
        verify(userRepo).save(user);
    }

    @Test
    void logoutStillReturnsOkWhenUserMissing() {
        AuthenticationManager authManager = mock(AuthenticationManager.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        LoginAuthController controller =
                new LoginAuthController(authManager, userRepo, assignmentService);

        when(userRepo.findByUsername("missing")).thenReturn(Optional.empty());

        ResponseEntity<Void> response = controller.logout("missing");

        assertEquals(200, response.getStatusCode().value());
        verify(userRepo, never()).save(any());
    }
}