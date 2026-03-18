package uk.ac.rhul.teamproject36.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.teamproject36.backend.auth.AppUser;
import uk.ac.rhul.teamproject36.backend.order.Customer;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.order.PaymentStatus;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.*;

/**
 * Seeds some orders at backend startup.
 */
@Component
@Order(3)
public class OrderDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(OrderDataSeeder.class);

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final AppUserRepository appUserRepository;

    public OrderDataSeeder(final OrderRepository orderRepository, 
                            final CustomerRepository customerRepository, 
                            final OrderItemRepository orderItemRepository, 
                            final MenuItemRepository menuItemRepository,
                           final AppUserRepository appUserRepository
        ) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    @Transactional
    public void run(final String... args) {
        // Check if we already have orders
        if (orderRepository.count() > 0) {
            log.info("Orders already exist in database, no need for order seeding");
            return;
        }

        // Check if we have menu items (seeded by MenuDataSeeder.java)
        if (menuItemRepository.count() == 0) {
            log.warn("No menu items found. Please ensure MenuDataSeeder runs first or has seeded data.");
            return;
        }

        log.info("Seeding sample orders...");
        seedSampleOrders();
    }

    private void seedSampleOrders() {
        List<MenuItem> menuItems = menuItemRepository.findAll();
        
        // Debug: print menu items to verify they have IDs
        for (MenuItem item : menuItems) {
            log.info("Menu item: ID={}, Name={}", item.getId(), item.getName());
        }

        // Just in case there is little menu choices
        if (menuItems.size() < 3) {
            log.warn("Less than 3 menu items available. Using available items: {}", menuItems.size());
        }

        Customer customer1 = createCustomer("Drizzy Drake", "07400223948");
        Customer customer2 = createCustomer("Bad Bunny", "07923120426");
        Customer customer3 = createCustomer("Kanye East", "07720313942");
        Customer customer4 = createCustomer("Druski", "07702225672");

        AppUser waiter01 = appUserRepository.findByUsername("waiter01")
                .orElseThrow(() -> new RuntimeException("waiter01 not found"));
        AppUser waiter02 = appUserRepository.findByUsername("waiter02")
                .orElseThrow(() -> new RuntimeException("waiter02 not found"));
        AppUser waiter03 = appUserRepository.findByUsername("waiter03")
                .orElseThrow(() -> new RuntimeException("waiter03 not found"));

        Instant yesterday = Instant.now().minus(1, ChronoUnit.DAYS);
        Instant twoDaysAgo = Instant.now().minus(2, ChronoUnit.DAYS);
        Instant lastWeek = Instant.now().minus(7, ChronoUnit.DAYS);
        Instant lastMonth = Instant.now().minus(30, ChronoUnit.DAYS);


        CustomerOrder order1 = createOrder(customer1, 5, OrderStatus.PLACED, Instant.now(), PaymentStatus.UNPAID, waiter01);
        addOrderItems(order1, menuItems, new int[]{2, 1, 0});
        CustomerOrder order2 = createOrder(customer2, 3, OrderStatus.PLACED, yesterday, PaymentStatus.UNPAID, waiter01);
        addOrderItems(order2, menuItems, new int[]{1, 2, 1});
        CustomerOrder order3 = createOrder(customer3, 8, OrderStatus.PLACED, lastMonth, PaymentStatus.UNPAID, waiter02);
        addOrderItems(order3, menuItems, new int[]{3, 0, 2});
        CustomerOrder order4 = createOrder(customer4, 2, OrderStatus.PLACED, Instant.now(), PaymentStatus.UNPAID, waiter02);
        addOrderItems(order4, menuItems, new int[]{1, 1, 1});
        CustomerOrder order5 = createOrder(customer1, 5, OrderStatus.PLACED, Instant.now(), PaymentStatus.UNPAID, waiter03);
        addOrderItems(order5, menuItems, new int[]{0, 2, 2});

        CustomerOrder order6 = createOrder(customer1, 8, OrderStatus.PLACED, lastWeek, PaymentStatus.UNPAID, waiter01);
        addOrderItems(order6, menuItems, new int[]{2, 1, 0, 1});
        CustomerOrder order7 = createOrder(customer4, 3, OrderStatus.PLACED, twoDaysAgo, PaymentStatus.UNPAID, waiter01);
        addOrderItems(order7, menuItems, new int[]{1, 0, 0, 0, 2});
        CustomerOrder order8 = createOrder(customer3, 8, OrderStatus.PLACED, lastMonth, PaymentStatus.UNPAID, waiter02);
        addOrderItems(order8, menuItems, new int[]{0, 0, 0, 1, 0, 0, 0 ,0, 2});
        CustomerOrder order9 = createOrder(customer2, 7, OrderStatus.PLACED, Instant.now(), PaymentStatus.UNPAID, waiter02);
        addOrderItems(order9, menuItems, new int[]{0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2});
        CustomerOrder order10 = createOrder(customer2, 1, OrderStatus.PLACED, lastMonth, PaymentStatus.UNPAID, waiter03);
        addOrderItems(order10, menuItems, new int[]{0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1});
        CustomerOrder order11 = createOrder(customer1, 1, OrderStatus.PLACED, lastMonth, PaymentStatus.UNPAID, waiter03);
        addOrderItems(order11, menuItems, new int[]{0, 1, 0, 0, 1, 0, 0, 1, 0, 2, 0, 0, 1});

        orderRepository.saveAll(List.of(order1, order2, order3, order4, order5, order6, order7, order8, order9, order10, order11));

        log.info("Seeded {} orders with items", orderRepository.count());

        List<CustomerOrder> allOrders = orderRepository.findAll();
        for (CustomerOrder order : allOrders) {
            log.info("waiter={}, createdAt={}, items={}",
                    order.getAssignedWaiter() != null ? order.getAssignedWaiter().getUsername() : "NULL",
                    order.getCreatedAt(),
                    order.getItems() != null ? order.getItems().size() : 0);
        }

    }

    private Customer createCustomer(String name, String phoneNumber) {
        Optional<Customer> existing = customerRepository.findByName(name);
        if (existing.isPresent()) {
            return existing.get();
        }

        Customer customer = new Customer();
        customer.setName(name);
        customer.setPhoneNumber(phoneNumber);
        return customerRepository.save(customer);
    }

    private CustomerOrder createOrder(Customer customer, int tableNumber, OrderStatus status, Instant createdAt, PaymentStatus paymentStatus, AppUser waiter) {
        CustomerOrder order = new CustomerOrder();
        order.setCustomer(customer);
        order.setTableNumber(tableNumber);
        order.setStatus(status);
        order.setCreatedAt(createdAt);
        order.setPaymentStatus(paymentStatus);
        order.setAssignedWaiter(waiter);
        return order;
    }

    private void addOrderItems(CustomerOrder order, List<MenuItem> menuItems, int[] quantities) {
        for (int i = 0; i < quantities.length && i < menuItems.size(); i++) {
            if (quantities[i] > 0) {
                MenuItem menuItem = menuItems.get(i);

                if (menuItem.getId() == null) {
                    log.error("Menu item {} has no ID!", menuItem.getName());
                    continue;
                }
                
                OrderItem item = new OrderItem();
                item.setMenuItem(menuItem);
                item.setQuantity(quantities[i]);
                order.addItem(item);
                
                log.debug("Added order item: {} x {} for menu item ID: {}", 
                        menuItem.getName(), quantities[i], menuItem.getId());
            }
        }
    }
}