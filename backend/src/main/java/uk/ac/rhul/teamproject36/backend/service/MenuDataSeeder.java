package uk.ac.rhul.teamproject36.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(MenuDataSeeder.class);

    private final MenuItemRepository menuItemRepository;

    public MenuDataSeeder(final MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @Override
    public void run(final String... args) {
        // Avoid duplicating rows on every start
        if (menuItemRepository.count() > 0) {
            log.info("Menu seed skipped (menu_item already contains data).");
            return;
        }

        final List<MenuItem> items = List.of(
                item("Chicken Tacos", "Grilled chicken with fresh salsa and lime", "8.50", 520, "gluten", true),
                item("Beef Burrito", "Slow cooked beef with rice and beans", "9.00", 680, "gluten,dairy", true),
                item("Vegetable Quesadilla", "Roasted vegetables with melted cheese", "7.50", 610, "gluten,dairy", true),
                item("Fish Tacos", "Battered fish with cabbage slaw", "8.75", 540, "gluten,fish", true),
                item("Nachos", "Corn chips topped with cheese and jalapeños", "6.50", 700, "dairy", true),
                item("Guacamole & Chips", "Fresh avocado dip with corn chips", "5.50", 390, "avocado", true),
                item("Pulled Pork Tacos", "Slow cooked pork with BBQ sauce", "8.75", 630, "gluten", true),
                item("Vegan Burrito Bowl", "Rice, beans, vegetables and salsa", "8.00", 560, "none", true),

                // Unavailable items (at least 2)
                item("Churros", "Fried dough with cinnamon sugar", "4.50", 450, "gluten", false),
                item("Spicy Wings", "Chicken wings with hot sauce", "7.25", 720, "gluten", false),

                // Add 2 more for a nicer demo (now 12 total)
                item("Chicken Burrito", "Rice, chicken, salsa, sour cream", "8.99", 650, "gluten,dairy", true),
                item("Coke", "330ml can", "1.80", 139, "none", true)
        );

        menuItemRepository.saveAll(items);
        log.info("Menu seed inserted {} items ({} unavailable).",
                items.size(),
                items.stream().filter(i -> !i.isAvailable()).count());
    }

    private MenuItem item(
            final String name,
            final String description,
            final String price,
            final Integer calories,
            final String allergens,
            final boolean available
    ) {
        final MenuItem m = new MenuItem();
        m.setName(name);
        m.setDescription(description);
        m.setPrice(new BigDecimal(price));
        m.setCalories(calories);
        m.setAllergens(allergens);
        m.setAvailable(available);
        return m;
    }
}
