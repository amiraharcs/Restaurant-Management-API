package uk.ac.rhul.teamproject36.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.teamproject36.backend.service.OrderService;

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
    
    @GetMapping("/orders/{id}")
    public OrderService.OrderDto getOrder(@PathVariable Long id) {
        return orderService.getOrder(id);
    }
}
