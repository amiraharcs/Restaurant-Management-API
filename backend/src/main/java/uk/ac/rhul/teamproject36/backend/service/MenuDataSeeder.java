package uk.ac.rhul.teamproject36.backend.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.rhul.teamproject36.backend.menu.Ingredient;
import uk.ac.rhul.teamproject36.backend.menu.ItemType;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.IngredientRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

@Component
public class MenuDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(MenuDataSeeder.class);

    private final MenuItemRepository menuItemRepository;
    private final IngredientRepository ingredientRepository;

    public MenuDataSeeder(MenuItemRepository menuItemRepository,
                          IngredientRepository ingredientRepository) {
        this.menuItemRepository = menuItemRepository;
        this.ingredientRepository = ingredientRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        if (menuItemRepository.count() > 0) {
            log.info("Menu seed skipped (menu_item already contains data).");
            return;
        }

        Map<String, Ingredient> ingredientCache = new HashMap<>();

        seedItem(
                ingredientCache,
                ItemType.FOOD,
                "Spaghetti Bolognese",
                "Classic spaghetti served with a slow-cooked beef and tomato ragu.",
                "9.99",
                720,
                "Gluten",
                true,
                "/images/menu/spaghetti-bolognese.jpg",
                List.of("Meat"),
                List.of("Spaghetti", "Beef mince", "Tomato", "Onion", "Garlic", "Olive oil", "Herbs")
        );

        seedItem(
                ingredientCache,
                ItemType.FOOD,
                "Chicken Alfredo Pasta",
                "Creamy parmesan sauce with grilled chicken served over pasta.",
                "10.99",
                850,
                "Gluten,Milk",
                true,
                "/images/menu/chicken-alfredo.jpg",
                List.of("Meat"),
                List.of("Pasta", "Chicken breast", "Cream", "Parmesan cheese", "Butter", "Garlic")
        );

        log.info("Menu seeded successfully.");
    }

    private void seedItem(
            Map<String, Ingredient> ingredientCache,
            ItemType type,
            String name,
            String description,
            String price,
            Integer calories,
            String allergens,
            boolean available,
            String imageUrl,
            List<String> filters,
            List<String> ingredientNames) {

        MenuItem item = new MenuItem();
        item.setItemType(type);
        item.setName(name);
        item.setDescription(description);
        item.setPrice(new BigDecimal(price));
        item.setCalories(calories);
        item.setAllergens(allergens);
        item.setAvailable(available);
        item.setImageUrl(imageUrl);

        applyFilters(item, filters);

        // 1️⃣ SAVE FIRST to generate ID
        menuItemRepository.save(item);

        // 2️⃣ Attach ingredients AFTER ID exists
        attachIngredients(item, ingredientCache, ingredientNames);

        // 3️⃣ Save again to populate join table
        menuItemRepository.save(item);
    }

    private void attachIngredients(MenuItem item,
                                   Map<String, Ingredient> ingredientCache,
                                   List<String> ingredientNames) {

        if (ingredientNames == null) return;

        for (String raw : ingredientNames) {

            if (raw == null) continue;

            String name = raw.trim();
            if (name.isEmpty()) continue;

            String key = name.toLowerCase();

            Ingredient ingredient = ingredientCache.computeIfAbsent(key, k ->
                    ingredientRepository.findByName(name)
                            .orElseGet(() -> {
                                Ingredient created = new Ingredient();
                                created.setName(name);
                                return ingredientRepository.save(created);
                            })
            );

            item.getIngredients().add(ingredient);
        }
    }

    private void applyFilters(MenuItem item, List<String> filters) {

        item.setVegetarian(false);
        item.setVegan(false);
        item.setGlutenFree(false);
        item.setHalal(false);

        if (filters == null) return;

        for (String f : filters) {

            if (f == null) continue;

            switch (f) {
                case "Vegetarian" -> item.setVegetarian(true);
                case "Vegan" -> item.setVegan(true);
                case "GlutenFree" -> item.setGlutenFree(true);
                case "Halal" -> item.setHalal(true);
                default -> { }
            }
        }
    }
}
