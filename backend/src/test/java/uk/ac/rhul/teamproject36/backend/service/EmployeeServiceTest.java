package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.repository.AppUserRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {
	@Test
    void getAllEmployeeData_returnsEmployeesWithNoOrders() {
        AppUserRepository userRepo = mock(AppUserRepository.class);
        OrderRepository orderRepo = mock(OrderRepository.class);

        AppUser user = new AppUser();
        user.setUsername("emp1");
        user.setRole("WAITER");
        user.setActive(true);
        user.setOnShift(true);

        when(userRepo.findByRoleNot("MANAGER")).thenReturn(List.of(user));
        when(orderRepo.findByAssignedWaiterUsername("emp1")).thenReturn(List.of());

        EmployeeService service = new EmployeeService(userRepo, orderRepo);

        var result = service.getAllEmployeeData();

        assertEquals(1, result.size());
        assertEquals("emp1", result.get(0).getUsername());
        assertEquals("WAITER", result.get(0).getRole());
        assertTrue(result.get(0).getActive());
        assertTrue(result.get(0).getOnShift());
        assertEquals(0, result.get(0).getTotalOrders());
        assertEquals(0, result.get(0).getTotalItemsSold());
        assertEquals(BigDecimal.ZERO, result.get(0).getTotalSales());
        assertTrue(result.get(0).getEmployeeOrders().isEmpty());
    }

}