package uk.ac.rhul.teamproject36.backend.controller;
 
import java.math.BigDecimal;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.teamproject36.backend.service.OrderService;
import uk.ac.rhul.teamproject36.backend.service.OrderService.OrderDto;
 
@RestController
@RequestMapping("/api")
public class StripeController {
 
    private final OrderService orderService;
 
    @Value("${stripe.secret.key:sk_test_dummy}")
    private String stripeSecretKey;
 
    @Value("${frontend.base.url:http://localhost:5173}")
    private String frontendBaseUrl;
 
    public StripeController(OrderService orderService) {
        this.orderService = orderService;
    }

    @Value("${stripe.secret.key:sk_test_dummy}")
    public static void setStripeApiKey(String key) {
        Stripe.apiKey = key;
    }
 
    @PostMapping("/orders/{id}/checkout")
    public ResponseEntity<?> createCheckoutSession(@PathVariable Long id) {

 
        // Load the order to build line items
        OrderDto order;
        try {
            order = orderService.getOrder(id);
        } catch (OrderService.NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("Order not found: " + id));
        }
 
        List<SessionCreateParams.LineItem> lineItems = order.items().stream()
                .map(item -> {
                    long unitAmountPence = item.price().multiply(BigDecimal.valueOf(100)).longValue();
 
                    return SessionCreateParams.LineItem.builder()
                            .setQuantity((long) item.quantity())
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("gbp")
                                            .setUnitAmount(unitAmountPence)
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(item.name())
                                                            .build())
                                            .build())
                            .build();
                })
                .toList();
 
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendBaseUrl + "/payment-success?orderId=" + id)
                    .setCancelUrl(frontendBaseUrl + "/order")
                    .putMetadata("orderId", String.valueOf(id))
                    .addAllLineItem(lineItems)
                    .build();
 
            Session session = Session.create(params);
            return ResponseEntity.ok(new CheckoutResponse(session.getUrl()));
 
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Stripe error: " + e.getMessage()));
        }
    }
 
    public record CheckoutResponse(String checkoutUrl) {}
    public record ErrorResponse(String error) {}
}