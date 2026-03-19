package uk.ac.rhul.teamproject36.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.order.Customer;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.order.PaymentStatus;
import uk.ac.rhul.teamproject36.backend.repository.CustomerRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;


@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final CustomerRepository customerRepository;
    private final AssignmentService assignmentService;

    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository,
        CustomerRepository customerRepository, AssignmentService assignmentService) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.customerRepository = customerRepository;
        this.assignmentService = assignmentService;
    }

    public record CreateOrderRequest(String name, String phoneNumber, Integer tableNumber, List<CreateOrderItem> items) {}
    public record CreateOrderItem(Long menuItemId, Integer quantity, String customisations) {}
    public record CreateOrderResponse(Long orderId, OrderStatus status, PaymentStatus paymentStatus) {}
    public record AddOrderItemRequest(Long menuItemId, Integer quantity, String customisations) {}
    


    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        if (request == null || request.items() == null || request.items().isEmpty()) {
            throw new BadRequestException("items must not be empty");
        }

        Customer newCustomer = new Customer();
        newCustomer.setName(request.name());
        newCustomer.setPhoneNumber(request.phoneNumber());
        customerRepository.save(newCustomer);

        CustomerOrder order = new CustomerOrder();
        order.setCustomer(newCustomer);
        order.setStatus(OrderStatus.PLACED);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setTableNumber(request.tableNumber());


        for (CreateOrderItem itemReq : request.items()) {
            if (itemReq == null || itemReq.menuItemId() == null) {
                throw new BadRequestException("menuItemId is required");
            }
            if (itemReq.quantity() == null || itemReq.quantity() <= 0) {
                throw new BadRequestException("quantity must be > 0");
            }

            MenuItem menuItem = menuItemRepository.findById(itemReq.menuItemId())
                    .orElseThrow(() -> new NotFoundException("menu item not found: " + itemReq.menuItemId()));

            if (!menuItem.isAvailable()) {
                throw new BadRequestException("menu item is not available: " + itemReq.menuItemId());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setCustomisations(itemReq.customisations());
            
            order.addItem(orderItem);
        }

        CustomerOrder saved = orderRepository.save(order);
        assignmentService.assignFromBuffer();
        return new CreateOrderResponse(saved.getId(), saved.getStatus(), saved.getPaymentStatus());
    }

    public static class BadRequestException extends RuntimeException {
        public BadRequestException(String msg) { super(msg); }
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String msg) { super(msg); }
    }
    
    public record OrderItemDto(Long menuItemId, String name, Integer quantity, String customisations) {}

    public record OrderDto(
        Long id,
        OrderStatus status,
        java.time.Instant createdAt,
        Integer tableNumber,
        String customerName,
        String customerPhoneNumber,
        PaymentStatus paymentStatus,
        List<OrderItemDto> items,
        String assignedWaiter  // null when order is still in buffer
    ) {}



    @Transactional(readOnly = true)
    public OrderDto getOrder(Long id) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("order not found: " + id));

        return toOrderDto(order);
    }

    /**
     * Confirms order if status is PLACED (waiter action).
     */
    @Transactional
    public OrderDto confirmOrder(Long id) {
      CustomerOrder order = orderRepository.findById(id)
          .orElseThrow(() -> new NotFoundException("order not found: " + id));

      if (order.getStatus() != OrderStatus.PLACED) {
        throw new BadRequestException("Invalid status transition: " + order.getStatus());
      }

      order.setStatus(OrderStatus.CONFIRMED);
      orderRepository.save(order);

      return toOrderDto(order);
    }

    /**
     * Accepts order if status is PLACED (kitchen action).
     */
    @Transactional
    public OrderDto acceptOrder(Long id) {
      CustomerOrder order = orderRepository.findById(id)
          .orElseThrow(() -> new NotFoundException("order not found: " + id));

      if (order.getStatus() != OrderStatus.CONFIRMED) {
        throw new BadRequestException("Invalid status transition: " + order.getStatus());
      }

      //checks if the item ordered is avaliable.
      for (OrderItem item : order.getItems()){
        MenuItem menuItem = item.getMenuItem();

        if (!menuItem.isAvailable()){
            throw new BadRequestException("Item:"+ menuItem.getName() +"is currently unavaliable.");
        }
      }

      order.setStatus(OrderStatus.PREPARING);
      orderRepository.save(order);

      return toOrderDto(order);
    }

    @Transactional
    public OrderDto markReady(Long id) {
      CustomerOrder order = orderRepository.findById(id)
          .orElseThrow(() -> new NotFoundException("order not found: " + id));

      if (order.getStatus() != OrderStatus.PREPARING) {
        throw new BadRequestException("Invalid status transition: " + order.getStatus());
      }

      order.setStatus(OrderStatus.READY);
      orderRepository.save(order);

      return toOrderDto(order);
    }

    private OrderDto toOrderDto(CustomerOrder order) {
      List<OrderItemDto> items = new ArrayList<>();
      for (var it : order.getItems()) {
        items.add(new OrderItemDto(
        it.getMenuItem().getId(),
        it.getMenuItem().getName(),
        it.getQuantity(),
        it.getCustomisations()
    ));
      }
      String waiterUsername = order.getAssignedWaiter() != null
          ? order.getAssignedWaiter().getUsername() : null;
      return new OrderDto(order.getId(), order.getStatus(), order.getCreatedAt(),
          order.getTableNumber(), order.getCustomer().getName(),
          order.getCustomer().getPhoneNumber(), order.getPaymentStatus(), items, waiterUsername);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
      List<CustomerOrder> orders = orderRepository.findAll();
      List<OrderDto> result = new ArrayList<>();
      for (CustomerOrder order : orders) {
        result.add(toOrderDto(order));
      }
      return result;
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByWaiter(String username) {
        List<CustomerOrder> orders = orderRepository.findByAssignedWaiterUsername(username);
        List<OrderDto> result = new ArrayList<>();
        for (CustomerOrder order : orders) {
            result.add(toOrderDto(order));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByStatus(OrderStatus status) {
        List<CustomerOrder> orders = orderRepository.findByStatus(status);

        List<OrderDto> result = new ArrayList<>();
        for (CustomerOrder order : orders) {
            result.add(toOrderDto(order));
        }

        return result;
    }

    /**
     * Cancels an order if it is not already DELIVERED or CANCELLED.
     */
    @Transactional
    public OrderDto cancelOrder(Long id) {
      CustomerOrder order = orderRepository.findById(id)
          .orElseThrow(() -> new NotFoundException("order not found: " + id));

      if (order.getStatus() == OrderStatus.DELIVERED
          || order.getStatus() == OrderStatus.CANCELLED) {
        throw new BadRequestException("Cannot cancel order in status: " + order.getStatus());
      }

      order.setStatus(OrderStatus.CANCELLED);
      orderRepository.save(order);

      return toOrderDto(order);
    }

    /**
     * Marks an order as DELIVERED if it is READY.
     */
    @Transactional
    public OrderDto markDelivered(Long id) {
      CustomerOrder order = orderRepository.findById(id)
          .orElseThrow(() -> new NotFoundException("order not found: " + id));

      if (order.getStatus() != OrderStatus.READY) {
        throw new BadRequestException(
            "Invalid status transition to DELIVERED from: " + order.getStatus());
      }

      order.setStatus(OrderStatus.DELIVERED);
      orderRepository.save(order);
      assignmentService.assignFromBuffer(); // decrement frees a slot; pull next from buffer

      return toOrderDto(order);
    }

    /**
     * Allows waiter to add an item to an existing order (for upselling).
     */
    @Transactional
    public OrderDto addOrderItem(Long orderId, AddOrderItemRequest request) {
      CustomerOrder order = orderRepository.findById(orderId)
          .orElseThrow(() -> new NotFoundException("order not found: " + orderId));

      // validate request
      if (request == null || request.menuItemId() == null) {
        throw new BadRequestException("menuItemId is required");
      }
      if (request.quantity() == null || request.quantity() <= 0) {
        throw new BadRequestException("quantity must be > 0");
      }

      MenuItem menuItem = menuItemRepository.findById(request.menuItemId())
          .orElseThrow(() -> new NotFoundException("menu item not found: " + request.menuItemId()));

      if (!menuItem.isAvailable()) {
        throw new BadRequestException("menu item is not available: " + request.menuItemId());
      }

      // check if item already exists in order
      Optional<OrderItem> existingItem = order.getItems().stream()
          .filter(i -> i.getMenuItem().getId().equals(request.menuItemId()))
          .findFirst();

      if (existingItem.isPresent()) {
          // increment quantity
          existingItem.get().setQuantity(existingItem.get().getQuantity() + request.quantity());
      } else {
          // add the new item
          OrderItem orderItem = new OrderItem();
          orderItem.setMenuItem(menuItem);
          orderItem.setQuantity(request.quantity());
          orderItem.setCustomisations(request.customisations());
          order.addItem(orderItem);
      }

      CustomerOrder saved = orderRepository.save(order);
      return toOrderDto(saved);
    }


    /**
     * Marks an order as PAID if it is currently UNPAID.
     */
    @Transactional
    public OrderDto markPaid(Long id) {
      CustomerOrder order = orderRepository.findById(id)
          .orElseThrow(() -> new NotFoundException("order not found: " + id));

      if (order.getPaymentStatus() != PaymentStatus.UNPAID) {
        throw new BadRequestException(
            "Invalid payment status transition from: " + order.getPaymentStatus());
      }

      order.setPaymentStatus(PaymentStatus.PAID);
      orderRepository.save(order);

      return toOrderDto(order);
    }

     /**
     * Marks an order as UNPAID if it is currently PAID.
     */
    @Transactional
    public OrderDto markUnpaid(Long id) {
      CustomerOrder order = orderRepository.findById(id)
          .orElseThrow(() -> new NotFoundException("order not found: " + id));

      if (order.getPaymentStatus() != PaymentStatus.PAID) {
        throw new BadRequestException(
            "Invalid payment status transition from: " + order.getPaymentStatus());
      }

      order.setPaymentStatus(PaymentStatus.UNPAID);
      orderRepository.save(order);

      return toOrderDto(order);
    }

}

