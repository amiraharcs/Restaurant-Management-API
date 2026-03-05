package uk.ac.rhul.teamproject36.backend.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.order.Customer;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.repository.CustomerRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.customerRepository = customerRepository;
    }

    public record CreateOrderRequest(String name, String phoneNumber, Integer tableNumber, List<CreateOrderItem> items) {}
    public record CreateOrderItem(Long menuItemId, Integer quantity) {}
    public record CreateOrderResponse(Long orderId, OrderStatus status) {}

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

            order.addItem(orderItem);
        }

        CustomerOrder saved = orderRepository.save(order);
        return new CreateOrderResponse(saved.getId(), saved.getStatus());
    }

    public static class BadRequestException extends RuntimeException {
        public BadRequestException(String msg) { super(msg); }
    }

    public static class NotFoundException extends RuntimeException {
        public NotFoundException(String msg) { super(msg); }
    }
    
    public record OrderItemDto(Long menuItemId, String name, Integer quantity) {}

    public record OrderDto(Long id, OrderStatus status, java.time.Instant createdAt,
        List<OrderItemDto> items) {
    }


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
        items.add(new OrderItemDto(it.getMenuItem().getId(), it.getMenuItem().getName(),
            it.getQuantity()));
      }
      return new OrderDto(order.getId(), order.getStatus(), order.getCreatedAt(), items);
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

    

}

