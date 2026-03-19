package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AssignmentServiceTest {

    @Test
    void testNoOrdersInBuffer() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        when(orderRepo.findByStatusAndAssignedWaiterIsNull(OrderStatus.PLACED))
                .thenReturn(List.of());

        AssignmentService service = new AssignmentService(orderRepo, userRepo);

        service.assignFromBuffer();
    }

    @Test
    void testNoWaitersAvailable() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        CustomerOrder order = new CustomerOrder();

        when(orderRepo.findByStatusAndAssignedWaiterIsNull(OrderStatus.PLACED))
                .thenReturn(List.of(order));

        when(userRepo.findByRoleAndOnShiftTrue("WAITER"))
                .thenReturn(List.of());

        AssignmentService service = new AssignmentService(orderRepo, userRepo);

        service.assignFromBuffer();
    }

    @Test
    void testAssignOrderToWaiter() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        CustomerOrder order = new CustomerOrder();
        AppUser waiter = new AppUser();
        waiter.setUsername("waiter1");

        when(orderRepo.findByStatusAndAssignedWaiterIsNull(OrderStatus.PLACED))
                .thenReturn(List.of(order));

        when(userRepo.findByRoleAndOnShiftTrue("WAITER"))
                .thenReturn(List.of(waiter));

        when(orderRepo.countActiveOrders(any(), any())).thenReturn(0L);

        AssignmentService service = new AssignmentService(orderRepo, userRepo);

        service.assignFromBuffer();

        verify(orderRepo).save(order);
    }

    @Test
    void testAssignsToLeastBusyWaiter() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        AppUserRepository userRepo = mock(AppUserRepository.class);

        CustomerOrder order = new CustomerOrder();

        AppUser waiter1 = new AppUser();
        waiter1.setUsername("w1");

        AppUser waiter2 = new AppUser();
        waiter2.setUsername("w2");

        when(orderRepo.findByStatusAndAssignedWaiterIsNull(OrderStatus.PLACED))
                .thenReturn(List.of(order));

        when(userRepo.findByRoleAndOnShiftTrue("WAITER"))
                .thenReturn(List.of(waiter1, waiter2));

        when(orderRepo.countActiveOrders(eq(waiter1), anyList())).thenReturn(5L);
        when(orderRepo.countActiveOrders(eq(waiter2), anyList())).thenReturn(1L);

        AssignmentService service = new AssignmentService(orderRepo, userRepo);

        service.assignFromBuffer();

        assertNotNull(order.getAssignedWaiter());
        assertEquals("w2", order.getAssignedWaiter().getUsername());
        verify(orderRepo).save(order);
    }
}