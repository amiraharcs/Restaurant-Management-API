package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.repository.CustomerRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderDataSeederTest {

    @Test
    void testRunNoMenuItems() throws Exception {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        OrderItemRepository orderItemRepo = mock(OrderItemRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        when(orderRepo.count()).thenReturn(0L);
        when(menuRepo.count()).thenReturn(0L);

        OrderDataSeeder seeder =
                new OrderDataSeeder(orderRepo, customerRepo, orderItemRepo, menuRepo, userRepo);

        seeder.run();
    }

    @Test
    void testRunWithMenuItemsButMissingWaiters() throws Exception {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        OrderItemRepository orderItemRepo = mock(OrderItemRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        when(orderRepo.count()).thenReturn(1L);

        OrderDataSeeder seeder =
                new OrderDataSeeder(orderRepo, customerRepo, orderItemRepo, menuRepo, userRepo);

        seeder.run();

        verify(menuRepo, never()).findAll();
        verify(orderRepo, never()).save(any());
    }

    @Test
    void testRunWithMenuItemsAndWaiters() throws Exception {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        OrderItemRepository orderItemRepo = mock(OrderItemRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        AppUser waiter1 = new AppUser();
        waiter1.setUsername("waiter01");

        AppUser waiter2 = new AppUser();
        waiter2.setUsername("waiter02");

        AppUser waiter3 = new AppUser();
        waiter3.setUsername("waiter03");

        when(orderRepo.count()).thenReturn(0L);
        when(menuRepo.count()).thenReturn(5L);
        when(menuRepo.findAll()).thenReturn(
                List.of(new uk.ac.rhul.teamproject36.backend.menu.MenuItem()));

        when(userRepo.findByUsername("waiter01")).thenReturn(Optional.of(waiter1));
        when(userRepo.findByUsername("waiter02")).thenReturn(Optional.of(waiter2));
        when(userRepo.findByUsername("waiter03")).thenReturn(Optional.of(waiter3));

        OrderDataSeeder seeder =
                new OrderDataSeeder(orderRepo, customerRepo, orderItemRepo, menuRepo, userRepo);

        seeder.run();

        verify(orderRepo, atLeastOnce()).saveAll(any());
    }
}