package uk.ac.rhul.teamproject36.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.teamproject36.backend.order.Customer;
import uk.ac.rhul.teamproject36.backend.order.CustomerOrder;
import uk.ac.rhul.teamproject36.backend.order.OrderItem;
import uk.ac.rhul.teamproject36.backend.order.OrderStatus;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.CustomerRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderRepository;
import uk.ac.rhul.teamproject36.backend.repository.OrderItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

/**
 * Seeds some orders at backend startup.
 */
@Component
public class OrderDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(OrderDataSeeder.class);

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderDataSeeder(final OrderRepository orderRepository, 
                            final CustomerRepository customerRepository, 
                            final OrderItemRepository orderItemRepository, 
                            final MenuItemRepository menuItemRepository
        ) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuItemRepository = menuItemRepository;
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

        CustomerOrder order1 = createOrder(customer1, 5, OrderStatus.PLACED, Instant.now());
        addOrderItems(order1, menuItems, new int[]{2, 1, 0});
        CustomerOrder order2 = createOrder(customer2, 3, OrderStatus.PREPARING, Instant.now());
        addOrderItems(order2, menuItems, new int[]{1, 2, 1});
        CustomerOrder order3 = createOrder(customer3, 8, OrderStatus.READY, Instant.now());
        addOrderItems(order3, menuItems, new int[]{3, 0, 2});
        CustomerOrder order4 = createOrder(customer4, 2, OrderStatus.PLACED, Instant.now());
        addOrderItems(order4, menuItems, new int[]{1, 1, 1});
        CustomerOrder order5 = createOrder(customer1, 5, OrderStatus.PREPARING, Instant.now());
        addOrderItems(order5, menuItems, new int[]{0, 2, 2});

        orderRepository.saveAll(List.of(order1, order2, order3, order4, order5));

        log.info("Seeded {} orders with items", orderRepository.count());
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

    private CustomerOrder createOrder(Customer customer, int tableNumber, OrderStatus status, Instant createdAt) {
        CustomerOrder order = new CustomerOrder();
        order.setCustomer(customer);
        order.setTableNumber(tableNumber);
        order.setStatus(status);
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