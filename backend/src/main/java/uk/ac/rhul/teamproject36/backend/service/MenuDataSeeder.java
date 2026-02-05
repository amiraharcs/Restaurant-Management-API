package main.java.uk.ac.rhul.teamproject36.backend.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds the database with sample menu items on application startup.
 */
@Component
public final class MenuDataSeeder implements CommandLineRunner {

    private final MenuItemRepository menuItemRepository;

    public MenuDataSeeder(final MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void run(final String... args) {
        if (menuItemRepository.count() > 0) {
            return; // Data already exists, do not reseed
        }

        final List<MenuItem> items = List.of(
                new MenuItem(
                        "Chicken Tacos",
                        "Grilled chicken with fresh salsa and lime",
                        new BigDecimal("8.50"),
                        520,
                        "gluten",
                        true
                ),
                new MenuItem(
                        "Beef Burrito",
                        "Slow cooked beef with rice and beans",
                        new BigDecimal("9.00"),
                        680,
                        "gluten, dairy",
                        true
                ),
                new MenuItem(
                        "Vegetable Quesadilla",
                        "Roasted vegetables with melted cheese",
                        new BigDecimal("7.50"),
                        610,
                        "gluten, dairy",
                        true
                ),
                new MenuItem(
                        "Fish Tacos",
                        "Battered fish with cabbage slaw",
                        new BigDecimal("8.75"),
                        540,
                        "gluten, fish",
                        true
                ),
                new MenuItem(
                        "Nachos",
                        "Corn chips topped with cheese and jalapeños",
                        new BigDecimal("6.50"),
                        700,
                        "dairy",
                        true
                ),
                new MenuItem(
                        "Churros",
                        "Fried dough with cinnamon sugar",
                        new BigDecimal("4.50"),
                        450,
                        "gluten",
                        false
                ),
                new MenuItem(
                        "Guacamole & Chips",
                        "Fresh avocado dip with corn chips",
                        new BigDecimal("5.50"),
                        390,
                        "none",
                        true
                ),
                new MenuItem(
                        "Pulled Pork Tacos",
                        "Slow cooked pork with BBQ sauce",
                        new BigDecimal("8.75"),
                        630,
                        "gluten",
                        true
                ),
                new MenuItem(
                        "Vegan Burrito Bowl",
                        "Rice, beans, vegetables and salsa",
                        new BigDecimal("8.00"),
                        560,
                        "none",
                        true
                ),
                new MenuItem(
                        "Spicy Wings",
                        "Chicken wings with hot sauce",
                        new BigDecimal("7.25"),
                        720,
                        "gluten",
                        false
                )
        );

        menuItemRepository.saveAll(items);
    }
}
