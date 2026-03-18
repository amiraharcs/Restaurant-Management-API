package uk.ac.rhul.teamproject36.backend.service;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.order.Customer;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.order.PaymentStatus;
import uk.ac.rhul.teamproject36.backend.repository.CustomerRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @Test
    void createOrder_rejectsEmptyItems() {
        OrderService service = new OrderService(
                mock(OrderRepository.class),
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        OrderService.BadRequestException ex = assertThrows(
                OrderService.BadRequestException.class,
                () -> service.createOrder(new OrderService.CreateOrderRequest("a", "b", 1, List.of()))
        );

        assertEquals("items must not be empty", ex.getMessage());
    }

    @Test
    void createOrder_rejectsMissingMenuItemId() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        OrderService service = new OrderService(orderRepo, menuRepo, customerRepo, assignmentService);

        OrderService.CreateOrderRequest request = new OrderService.CreateOrderRequest(
                "Amir",
                "123",
                4,
                List.of(new OrderService.CreateOrderItem(null, 1))
        );

        assertThrows(OrderService.BadRequestException.class, () -> service.createOrder(request));
    }

    @Test
    void createOrder_rejectsBadQuantity() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        OrderService service = new OrderService(orderRepo, menuRepo, customerRepo, assignmentService);

        OrderService.CreateOrderRequest request = new OrderService.CreateOrderRequest(
                "Amir",
                "123",
                4,
                List.of(new OrderService.CreateOrderItem(1L, 0))
        );

        assertThrows(OrderService.BadRequestException.class, () -> service.createOrder(request));
    }

    @Test
    void createOrder_rejectsMissingMenuItem() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        when(menuRepo.findById(9L)).thenReturn(Optional.empty());

        OrderService service = new OrderService(orderRepo, menuRepo, customerRepo, assignmentService);

        OrderService.CreateOrderRequest request = new OrderService.CreateOrderRequest(
                "Amir",
                "123",
                4,
                List.of(new OrderService.CreateOrderItem(9L, 1))
        );

        assertThrows(OrderService.NotFoundException.class, () -> service.createOrder(request));
    }

    @Test
    void createOrder_rejectsUnavailableMenuItem() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        MenuItem item = new MenuItem();
        item.setAvailable(false);

        when(menuRepo.findById(1L)).thenReturn(Optional.of(item));

        OrderService service = new OrderService(orderRepo, menuRepo, customerRepo, assignmentService);

        OrderService.CreateOrderRequest request = new OrderService.CreateOrderRequest(
                "Amir",
                "123",
                4,
                List.of(new OrderService.CreateOrderItem(1L, 1))
        );

        assertThrows(OrderService.BadRequestException.class, () -> service.createOrder(request));
    }

    @Test
    void createOrder_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        CustomerRepository customerRepo = mock(CustomerRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);

        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setName("Taco");
        item.setAvailable(true);

        when(menuRepo.findById(1L)).thenReturn(Optional.of(item));
        when(customerRepo.save(any(Customer.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepo.save(any(CustomerOrder.class))).thenAnswer(inv -> {
            CustomerOrder order = inv.getArgument(0);
            order.setStatus(OrderStatus.PLACED);
            order.setPaymentStatus(PaymentStatus.UNPAID);
            return order;
        });

        OrderService service = new OrderService(orderRepo, menuRepo, customerRepo, assignmentService);

        OrderService.CreateOrderRequest request = new OrderService.CreateOrderRequest(
                "Amir",
                "123",
                4,
                List.of(new OrderService.CreateOrderItem(1L, 2))
        );

        OrderService.CreateOrderResponse response = service.createOrder(request);

        assertEquals(OrderStatus.PLACED, response.status());
        assertEquals(PaymentStatus.UNPAID, response.paymentStatus());
        verify(orderRepo).save(any(CustomerOrder.class));
        verify(assignmentService).assignFromBuffer();
    }

    @Test
    void getOrder_notFound() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        when(orderRepo.findById(1L)).thenReturn(Optional.empty());

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertThrows(OrderService.NotFoundException.class, () -> service.getOrder(1L));
    }

    @Test
    void getOrder_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        OrderService.OrderDto dto = service.getOrder(1L);

        assertEquals("Amir", dto.customerName());
        assertEquals(1, dto.items().size());
    }

    @Test
    void confirmOrder_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        OrderService.OrderDto dto = service.confirmOrder(1L);

        assertEquals(OrderStatus.CONFIRMED, dto.status());
        verify(orderRepo).save(order);
    }

    @Test
    void confirmOrder_badTransition() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.READY, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertThrows(OrderService.BadRequestException.class, () -> service.confirmOrder(1L));
    }

    @Test
    void acceptOrder_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.CONFIRMED, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        OrderService.OrderDto dto = service.acceptOrder(1L);

        assertEquals(OrderStatus.PREPARING, dto.status());
        verify(orderRepo).save(order);
    }

    @Test
    void acceptOrder_rejectsUnavailableExistingItem() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.CONFIRMED, PaymentStatus.UNPAID, false);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertThrows(OrderService.BadRequestException.class, () -> service.acceptOrder(1L));
    }

    @Test
    void markReady_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PREPARING, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertEquals(OrderStatus.READY, service.markReady(1L).status());
    }

    @Test
    void cancelOrder_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertEquals(OrderStatus.CANCELLED, service.cancelOrder(1L).status());
    }

    @Test
    void cancelOrder_rejectsDelivered() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.DELIVERED, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertThrows(OrderService.BadRequestException.class, () -> service.cancelOrder(1L));
    }

    @Test
    void markDelivered_successAlsoAssignsFromBuffer() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        AssignmentService assignmentService = mock(AssignmentService.class);
        CustomerOrder order = buildOrder(OrderStatus.READY, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                assignmentService);

        assertEquals(OrderStatus.DELIVERED, service.markDelivered(1L).status());
        verify(assignmentService).assignFromBuffer();
    }

    @Test
    void addOrderItem_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        MenuItemRepository menuRepo = mock(MenuItemRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.UNPAID, true);

        MenuItem extra = new MenuItem();
        extra.setId(99L);
        extra.setName("Drink");
        extra.setAvailable(true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
        when(menuRepo.findById(99L)).thenReturn(Optional.of(extra));
        when(orderRepo.save(order)).thenReturn(order);

        OrderService service = new OrderService(
                orderRepo,
                menuRepo,
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        OrderService.OrderDto dto = service.addOrderItem(1L, new OrderService.AddOrderItemRequest(99L, 1));

        assertEquals(2, dto.items().size());
    }

    @Test
    void addOrderItem_rejectsBadQuantity() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertThrows(OrderService.BadRequestException.class,
                () -> service.addOrderItem(1L, new OrderService.AddOrderItemRequest(5L, 0)));
    }

    @Test
    void markPaid_success() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.UNPAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertEquals(PaymentStatus.PAID, service.markPaid(1L).paymentStatus());
    }

    @Test
    void markPaid_rejectsAlreadyPaid() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.PAID, true);

        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertThrows(OrderService.BadRequestException.class, () -> service.markPaid(1L));
    }

    @Test
    void getAllOrdersAndGetByStatusAndWaiter_delegateCorrectly() {
        OrderRepository orderRepo = mock(OrderRepository.class);
        CustomerOrder order = buildOrder(OrderStatus.PLACED, PaymentStatus.UNPAID, true);

        when(orderRepo.findAll()).thenReturn(List.of(order));
        when(orderRepo.findByStatus(OrderStatus.PLACED)).thenReturn(List.of(order));
        when(orderRepo.findByAssignedWaiterUsername("amir")).thenReturn(List.of(order));

        OrderService service = new OrderService(
                orderRepo,
                mock(MenuItemRepository.class),
                mock(CustomerRepository.class),
                mock(AssignmentService.class));

        assertEquals(1, service.getAllOrders().size());
        assertEquals(1, service.getOrdersByStatus(OrderStatus.PLACED).size());
        assertEquals(1, service.getOrdersByWaiter("amir").size());
    }

    private CustomerOrder buildOrder(OrderStatus status, PaymentStatus paymentStatus, boolean available) {
        Customer customer = new Customer();
        customer.setName("Amir");
        customer.setPhoneNumber("123");

        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setName("Taco");
        item.setPrice(new BigDecimal("10.00"));
        item.setCostToProduce(new BigDecimal("4.00"));
        item.setAvailable(available);

        OrderItem orderItem = new OrderItem();
        orderItem.setMenuItem(item);
        orderItem.setQuantity(2);

        CustomerOrder order = new CustomerOrder();
        order.setCustomer(customer);
        order.setStatus(status);
        order.setPaymentStatus(paymentStatus);
        order.setTableNumber(3);
        order.addItem(orderItem);

        return order;
    }
}