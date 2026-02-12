package uk.ac.rhul.teamproject36.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderService(OrderRepository orderRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public record CreateOrderRequest(List<CreateOrderItem> items) {}
    public record CreateOrderItem(Long menuItemId, Integer quantity) {}
    public record CreateOrderResponse(Long orderId, OrderStatus status) {}

    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request) {
        if (request == null || request.items() == null || request.items().isEmpty()) {
            throw new BadRequestException("items must not be empty");
        }

        CustomerOrder order = new CustomerOrder();
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
}
