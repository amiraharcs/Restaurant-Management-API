package uk.ac.rhul.teamproject36.backend.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.service.OrderService;
import uk.ac.rhul.teamproject36.backend.service.OrderService.OrderDto;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderService.CreateOrderResponse createOrder(@RequestBody OrderService.CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/orders/{id}")
    public OrderService.OrderDto getOrder(@PathVariable Long id) {
      return orderService.getOrder(id);
    }

    @GetMapping("/orders")
    public List<OrderDto> getAllOrders() {
      return orderService.getAllOrders();
    }

    @GetMapping("/orders/status/{status}")
    public List<OrderDto> getOrdersByStatus(@PathVariable OrderStatus status) {
      return orderService.getOrdersByStatus(status);
    }

    @PatchMapping("/orders/{id}/confirm")
    public OrderDto confirmOrder(@PathVariable Long id) {
      return orderService.confirmOrder(id);
    }

    @PatchMapping("/orders/{id}/accept")
    public OrderDto acceptOrder(@PathVariable Long id) {
      return orderService.acceptOrder(id);
    }

    @PatchMapping("/orders/{id}/ready")
    public OrderDto markReady(@PathVariable Long id) {
      return orderService.markReady(id);
    }

    @PatchMapping("/orders/{id}/paid")
    public OrderDto markPaid(@PathVariable Long id) {
      return orderService.markPaid(id);
    }

    @ExceptionHandler(OrderService.BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequest(OrderService.BadRequestException ex) {
        return new ErrorResponse(ex.getMessage());
    }

    @ExceptionHandler(OrderService.NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(OrderService.NotFoundException ex) {
        return new ErrorResponse(ex.getMessage());
    }

    public record ErrorResponse(String error) {}


    @PatchMapping("/orders/{id}/cancel")
    public OrderDto cancelOrder(@PathVariable Long id) {
      return orderService.cancelOrder(id);
    }

    @PatchMapping("/orders/{id}/deliver")
    public OrderDto deliverOrder(@PathVariable Long id) {
      return orderService.markDelivered(id);
    }

    // Returns all orders assigned to the given waiter
    @GetMapping("/orders/waiter/{username}")
    public List<OrderDto> getOrdersByWaiter(@PathVariable String username) {
      return orderService.getOrdersByWaiter(username);
    }

    @PatchMapping("/orders/{id}/items")
    public OrderDto addOrderItem(@PathVariable Long id,
        @RequestBody OrderService.AddOrderItemRequest request) {
      return orderService.addOrderItem(id, request);
    }

  }

