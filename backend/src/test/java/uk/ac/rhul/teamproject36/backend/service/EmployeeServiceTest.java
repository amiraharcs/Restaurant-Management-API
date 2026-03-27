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
	  @Test
	    void getAllEmployeeData_calculatesTotalsCorrectly() {
	        AppUserRepository userRepo = mock(AppUserRepository.class);
	        OrderRepository orderRepo = mock(OrderRepository.class);

	        AppUser user = new AppUser();
	        user.setUsername("emp1");
	        user.setRole("WAITER");
	        user.setActive(true);
	        user.setOnShift(true);

	        MenuItem menuItem = new MenuItem();
	        menuItem.setPrice(new BigDecimal("10.00"));

	        OrderItem item = new OrderItem();
	        item.setMenuItem(menuItem);
	        item.setQuantity(2);

	        CustomerOrder order = new CustomerOrder();
	        order.setStatus(OrderStatus.PLACED);
	        order.addItem(item);

	        when(userRepo.findByRoleNot("MANAGER")).thenReturn(List.of(user));
	        when(orderRepo.findByAssignedWaiterUsername("emp1")).thenReturn(List.of(order));

	        EmployeeService service = new EmployeeService(userRepo, orderRepo);

	        var result = service.getAllEmployeeData();

	        assertEquals(1, result.size());

	        var dto = result.get(0);
	        assertEquals("emp1", dto.getUsername());
	        assertEquals(1, dto.getTotalOrders());
	        assertEquals(2, dto.getTotalItemsSold());
	        assertEquals(new BigDecimal("20.00"), dto.getTotalSales());
	        assertEquals(1, dto.getEmployeeOrders().size());

	        var orderDto = dto.getEmployeeOrders().get(0);
	        assertEquals(OrderStatus.PLACED, orderDto.getStatus());
	        assertEquals(2, orderDto.getNumberOfItems());
	        assertEquals(new BigDecimal("20.00"), orderDto.getOrderTotal());
	        assertNotNull(orderDto.getOrderDateTime());
	    }
	  @Test
	    void getAllEmployeeData_multipleEmployees() {
	        AppUserRepository userRepo = mock(AppUserRepository.class);
	        OrderRepository orderRepo = mock(OrderRepository.class);

	        AppUser user1 = new AppUser();
	        user1.setUsername("emp1");
	        user1.setRole("WAITER");
	        user1.setActive(true);

	        AppUser user2 = new AppUser();
	        user2.setUsername("emp2");
	        user2.setRole("KITCHEN");
	        user2.setActive(false);

	        when(userRepo.findByRoleNot("MANAGER")).thenReturn(List.of(user1, user2));
	        when(orderRepo.findByAssignedWaiterUsername("emp1")).thenReturn(List.of());
	        when(orderRepo.findByAssignedWaiterUsername("emp2")).thenReturn(List.of());

	        EmployeeService service = new EmployeeService(userRepo, orderRepo);

	        var result = service.getAllEmployeeData();

	        assertEquals(2, result.size());
	        verify(orderRepo).findByAssignedWaiterUsername("emp1");
	        verify(orderRepo).findByAssignedWaiterUsername("emp2");
	    }
	  private AppUser employee(String username, String role, boolean active, boolean onShift) {
	        AppUser user = new AppUser();
	        user.setUsername(username);
	        user.setRole(role);
	        user.setActive(active);
	        user.setOnShift(onShift);
	        return user;
	    }
}