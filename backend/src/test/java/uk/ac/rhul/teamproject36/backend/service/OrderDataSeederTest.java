package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.repository.CustomerRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

import static org.mockito.Mockito.*;

class OrderDataSeederTest {

    @Test
    void testRunNoMenuItems() throws Exception {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        OrderItemRepository orderItemRepo = mock(OrderItemRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);

        when(orderRepo.count()).thenReturn(0L);
        when(menuRepo.count()).thenReturn(0L);

        OrderDataSeeder seeder =
                new OrderDataSeeder(orderRepo, customerRepo, orderItemRepo, menuRepo);

        seeder.run();
    }
}