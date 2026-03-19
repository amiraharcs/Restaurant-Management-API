package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import java.util.List;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.repository.CustomerRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;
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
    void testRunWithMenuItems() throws Exception {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        OrderItemRepository orderItemRepo = mock(OrderItemRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        when(orderRepo.count()).thenReturn(0L);
        when(menuRepo.count()).thenReturn(5L);
        when(menuRepo.findAll()).thenReturn(List.of(new uk.ac.rhul.teamproject36.backend.menu.MenuItem()));

        OrderDataSeeder seeder =
                new OrderDataSeeder(orderRepo, customerRepo, orderItemRepo, menuRepo, userRepo);

        seeder.run();

        verify(orderRepo, atLeastOnce()).save(any());
    }
}