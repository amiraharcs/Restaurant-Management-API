package uk.ac.rhul.teamproject36.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import uk.ac.rhul.teamproject36.backend.menu.ItemType;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

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
            // =========================
            // MAIN (FOOD)
            // =========================
            item(
                ItemType.FOOD,
                "Spaghetti Bolognese",
                "Classic spaghetti served with a slow-cooked beef and tomato ragu.",
                "9.99",
                720,
                "Gluten",
                true,
                "/images/menu/spaghetti-bolognese.jpg",
                List.of("Meat")
            ),
            item(
                ItemType.FOOD,
                "Chicken Alfredo Pasta",
                "Creamy parmesan sauce with grilled chicken served over pasta.",
                "10.99",
                850,
                "Gluten,Milk",
                true,
                "/images/menu/chicken-alfredo.jpg",
                List.of("Meat")
            ),

            // =========================
            // DESSERT
            // =========================
            item(
                ItemType.DESSERT,
                "Chocolate Brownie",
                "Warm chocolate brownie served with a rich cocoa flavour.",
                "4.99",
                430,
                "Gluten,Eggs,Milk",
                true,
                "/images/menu/chocolate-brownie.jpg",
                List.of("Vegetarian")
            ),

            // =========================
            // DRINKS
            // =========================
            item(
                ItemType.DRINK,
                "Coca-Cola",
                "Chilled sparkling cola served in a bottle or can.",
                "2.50",
                140,
                "",
                true,
                "/images/menu/coca-cola.jpg",
                List.of("Vegan", "Vegetarian", "GlutenFree")
            ),
            item(
                ItemType.DRINK,
                "Sparkling Water",
                "Refreshing sparkling mineral water.",
                "2.20",
                0,
                "",
                true,
                "/images/menu/sparkling-water.jpg",
                List.of("Vegan", "Vegetarian", "GlutenFree")
            )
        );

        menuItemRepository.saveAll(items);
        log.info("Menu seed inserted {} items ({} unavailable).",
            items.size(),
            items.stream().filter(i -> !i.isAvailable()).count());
    }

    private MenuItem item(
        final ItemType itemType,
        final String name,
        final String description,
        final String price,
        final Integer calories,
        final String allergensCsv,
        final boolean available,
        final String imageUrl,
        final List<String> filters
    ) {
        final MenuItem m = new MenuItem();
        m.setItemType(itemType);
        m.setName(name);
        m.setDescription(description);
        m.setPrice(new BigDecimal(price));
        m.setCalories(calories);
        m.setAllergens(allergensCsv);
        m.setAvailable(available);
        m.setImageUrl(imageUrl);

        applyFilters(m, filters);
        return m;
    }

    private void applyFilters(final MenuItem item, final List<String> filters) {
        // Default values
        item.setVegetarian(false);
        item.setVegan(false);
        item.setGlutenFree(false);
        item.setHalal(false);

        if (filters == null) {
            return;
        }

        for (String f : filters) {
            if (f == null) {
                continue;
            }

            switch (f) {
                case "Vegetarian" -> item.setVegetarian(true);
                case "Vegan" -> item.setVegan(true);
                case "GlutenFree" -> item.setGlutenFree(true);
                case "Halal" -> item.setHalal(true);
                default -> {
                    // Ignore things like "Meat" (UI label only).
                }
            }
        }
    }
}
