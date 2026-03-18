package uk.ac.rhul.teamproject36.backend.controller;

import org.junit.jupiter.api.Test;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.service.OrderService;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderControllerTest {

    @Test
    void createOrderDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        OrderService.CreateOrderRequest request = null;
        when(orderService.createOrder(request)).thenReturn(null);

        OrderService.CreateOrderResponse response = controller.createOrder(request);

        assertNull(response);
        verify(orderService).createOrder(request);
    }

    @Test
    void getOrderDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.getOrder(1L)).thenReturn(null);

        OrderService.OrderDto result = controller.getOrder(1L);

        assertNull(result);
        verify(orderService).getOrder(1L);
    }

    @Test
    void getAllOrdersDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.getAllOrders()).thenReturn(Collections.emptyList());

        List<OrderService.OrderDto> result = controller.getAllOrders();

        assertNotNull(result);
        verify(orderService).getAllOrders();
    }

    @Test
    void getOrdersByStatusDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.getOrdersByStatus(OrderStatus.PLACED)).thenReturn(Collections.emptyList());

        List<OrderService.OrderDto> result = controller.getOrdersByStatus(OrderStatus.PLACED);

        assertNotNull(result);
        verify(orderService).getOrdersByStatus(OrderStatus.PLACED);
    }

    @Test
    void confirmOrderDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.confirmOrder(1L)).thenReturn(null);

        OrderService.OrderDto result = controller.confirmOrder(1L);

        assertNull(result);
        verify(orderService).confirmOrder(1L);
    }

    @Test
    void acceptOrderDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.acceptOrder(1L)).thenReturn(null);

        OrderService.OrderDto result = controller.acceptOrder(1L);

        assertNull(result);
        verify(orderService).acceptOrder(1L);
    }

    @Test
    void markReadyDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.markReady(1L)).thenReturn(null);

        OrderService.OrderDto result = controller.markReady(1L);

        assertNull(result);
        verify(orderService).markReady(1L);
    }

    @Test
    void markPaidDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.markPaid(1L)).thenReturn(null);

        OrderService.OrderDto result = controller.markPaid(1L);

        assertNull(result);
        verify(orderService).markPaid(1L);
    }

    @Test
    void cancelOrderDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.cancelOrder(1L)).thenReturn(null);

        OrderService.OrderDto result = controller.cancelOrder(1L);

        assertNull(result);
        verify(orderService).cancelOrder(1L);
    }

    @Test
    void deliverOrderDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.markDelivered(1L)).thenReturn(null);

        OrderService.OrderDto result = controller.deliverOrder(1L);

        assertNull(result);
        verify(orderService).markDelivered(1L);
    }

    @Test
    void getOrdersByWaiterDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        when(orderService.getOrdersByWaiter("amir")).thenReturn(Collections.emptyList());

        List<OrderService.OrderDto> result = controller.getOrdersByWaiter("amir");

        assertNotNull(result);
        verify(orderService).getOrdersByWaiter("amir");
    }

    @Test
    void addOrderItemDelegatesToService() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        OrderService.AddOrderItemRequest request = null;
        when(orderService.addOrderItem(1L, request)).thenReturn(null);

        OrderService.OrderDto result = controller.addOrderItem(1L, request);

        assertNull(result);
        verify(orderService).addOrderItem(1L, request);
    }

    @Test
    void handleBadRequestReturnsErrorResponse() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        OrderController.ErrorResponse response =
                controller.handleBadRequest(new OrderService.BadRequestException("bad"));

        assertEquals("bad", response.error());
    }

    @Test
    void handleNotFoundReturnsErrorResponse() {
        OrderService orderService = mock(OrderService.class);
        OrderController controller = new OrderController(orderService);

        OrderController.ErrorResponse response =
                controller.handleNotFound(new OrderService.NotFoundException("missing"));

        assertEquals("missing", response.error());
    }
}