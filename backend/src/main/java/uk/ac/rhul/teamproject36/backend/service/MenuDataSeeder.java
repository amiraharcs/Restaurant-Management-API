package uk.ac.rhul.teamproject36.backend.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.rhul.teamproject36.backend.menu.Ingredient;
import uk.ac.rhul.teamproject36.backend.menu.ItemType;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.IngredientRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

@Component
@Order(2)
public class MenuDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(MenuDataSeeder.class);

    private final MenuItemRepository menuItemRepository;
    private final IngredientRepository ingredientRepository;
    private final Environment env;

    public MenuDataSeeder(final MenuItemRepository menuItemRepository,
                          final IngredientRepository ingredientRepository,
                          final Environment env) {
        this.menuItemRepository = menuItemRepository;
        this.ingredientRepository = ingredientRepository;
        this.env = env;
    }

    @Override
    @Transactional
    public void run(final String... args) {

        // Optional reset mode:
        // APP_SEED_RESET=true -> clears menu + ingredients then reseeds
        final boolean reset = Boolean.parseBoolean(env.getProperty("APP_SEED_RESET", "false"));
        if (reset) {
            log.warn("APP_SEED_RESET=true -> clearing menu_item_ingredient/menu_item/ingredient then reseeding");
            menuItemRepository.deleteAllInBatch();     // join table rows removed by FK cascade
            ingredientRepository.deleteAllInBatch();
        }

        // Cache ingredients (avoid duplicate insert + reuse existing)
        final Map<String, Ingredient> ingredientCache = new HashMap<>();

        // Cache existing menu items by unique key (type|name) so we only insert missing ones
        final Map<String, MenuItem> existing = new HashMap<>();
        for (MenuItem mi : menuItemRepository.findAll()) {
            final String key = key(mi.getItemType(), mi.getName());
            existing.put(key, mi);
        }

        final List<MenuItem> seedItems = List.of(
            // =========================
            // MAIN (FOOD)
            // =========================
                item(
                        ingredientCache,
                        ItemType.FOOD,
                        "Chicken Fajitas",
                        "Sizzling grilled chicken served with peppers, onions and warm flour tortillas.",
                        "11.99",
                        "2.00",
                        780,
                        "Gluten",
                        true,
                        "/images/menu/chicken-fajitas.jpg",
                        List.of("Meat"),
                        List.of("Chicken breast", "Bell peppers", "Onion", "Flour tortillas", "Lime", "Spices")
                ),
                item(
                        ingredientCache,
                        ItemType.FOOD,
                        "Beef Tacos",
                        "Soft corn tortillas filled with seasoned beef, fresh salsa and shredded lettuce.",
                        "8.99",
                        "2.00",
                        640,
                        "",
                        true,
                        "/images/menu/beef-tacos.jpg",
                        List.of("Meat", "GlutenFree"),
                        List.of("Corn tortillas", "Beef mince", "Tomato salsa", "Lettuce", "Cheddar cheese", "Sour cream")
                ),
                item(
                        ingredientCache,
                        ItemType.FOOD,
                        "Chicken Quesadilla",
                        "Grilled tortilla stuffed with melted cheese and spiced chicken.",
                        "9.49",
                        "2.00",
                        700,
                        "Gluten,Milk",
                        true,
                        "/images/menu/chicken-quesadilla.jpg",
                        List.of("Meat"),
                        List.of("Flour tortilla", "Chicken breast", "Mozzarella", "Cheddar", "Peppers", "Onion")
                ),
                item(
                        ingredientCache,
                        ItemType.FOOD,
                        "Beef Burrito",
                        "Large flour tortilla wrapped with seasoned beef, rice, beans and salsa.",
                        "10.49",
                        "2.00",
                        920,
                        "Gluten",
                        true,
                        "/images/menu/beef-burrito.jpg",
                        List.of("Meat"),
                        List.of("Flour tortilla", "Beef mince", "Mexican rice", "Black beans", "Salsa", "Cheese")
                ),
                item(
                        ingredientCache,
                        ItemType.FOOD,
                        "Bean & Cheese Burrito",
                        "Large flour tortilla filled with seasoned black beans, rice and melted cheese.",
                        "9.29",
                        "2.00",
                        820,
                        "Gluten,Milk",
                        true,
                        "/images/menu/bean-cheese-burrito.jpeg",
                        List.of("Vegetarian"),
                        List.of("Flour tortilla", "Black beans", "Mexican rice", "Cheese", "Salsa", "Coriander")
                ),
                item(
                        ingredientCache,
                        ItemType.FOOD,
                        "Veggie Tacos",
                        "Soft corn tortillas filled with grilled vegetables, black beans and fresh salsa.",
                        "8.49",
                        "2.00",
                        550,
                        "",
                        true,
                        "/images/menu/veggie-tacos.jpg",
                        List.of("Vegetarian", "GlutenFree", "Vegan"),
                        List.of("Corn tortillas", "Black beans", "Bell peppers", "Onion", "Tomato salsa", "Lettuce")
                ),

            // =========================
            // DESSERT
            // =========================
            item(
                ingredientCache,
                ItemType.DESSERT,
                "Chocolate Brownie",
                "Warm chocolate brownie served with a rich cocoa flavour.",
                "4.99",
                "0.50",
                430,
                "Gluten,Egg,Milk",
                true,
                "/images/menu/chocolate-brownie.jpg",
                List.of("Vegetarian"),
                List.of("Flour", "Cocoa powder", "Butter", "Eggs", "Sugar", "Chocolate")
            ),
                item(
                        ingredientCache,
                        ItemType.DESSERT,
                        "Churros with Chocolate",
                        "Crispy fried dough sticks coated in cinnamon sugar, served with warm chocolate dip.",
                        "6.49",
                        "1.00",
                        520,
                        "Gluten,Milk,Egg",
                        true,
                        "/images/menu/churros.jpg",
                        List.of("Vegetarian"),
                        List.of("Flour", "Sugar", "Cinnamon", "Eggs", "Butter", "Dark chocolate")
                ),
                item(
                        ingredientCache,
                        ItemType.DESSERT,
                        "Tres Leches Cake",
                        "Light sponge cake soaked in three kinds of milk and topped with whipped cream.",
                        "6.99",
                        "0.50",
                        610,
                        "Gluten,Milk,Egg",
                        true,
                        "/images/menu/tres-leches.jpg",
                        List.of("Vegetarian"),
                        List.of("Flour", "Condensed milk", "Evaporated milk", "Cream", "Eggs", "Sugar")
                ),
                item(
                        ingredientCache,
                        ItemType.DESSERT,
                        "Mango Sorbet",
                        "Refreshing dairy-free mango sorbet made with ripe mangoes and a hint of lime.",
                        "5.49",
                        "0.50",
                        180,
                        "",
                        true,
                        "/images/menu/mango-sorbet.jpg",
                        List.of("Vegan", "Vegetarian", "GlutenFree"),
                        List.of("Mango", "Sugar", "Lime juice", "Water")
                ),

            // =========================
            // DRINKS
            // =========================
            item(
                ingredientCache,
                ItemType.DRINK,
                "Coca-Cola",
                "Chilled sparkling cola served in a bottle or can.",
                "2.50",
                "0.10",
                140,
                "",
                true,
                "/images/menu/coca-cola.jpg",
                List.of("Vegan", "Vegetarian", "GlutenFree"),
                List.of("Carbonated water", "Sugar", "Colour (caramel E150d)",
                    "Phosphoric acid", "Natural flavourings", "Caffeine")
            ),
            item(
                ingredientCache,
                ItemType.DRINK,
                "Sparkling Water",
                "Refreshing sparkling mineral water.",
                "2.20",
                "0.10",
                0,
                "",
                true,
                "/images/menu/sparkling-water.jpg",
                List.of("Vegan", "Vegetarian", "GlutenFree"),
                List.of("Carbonated water")
            )
        );

        int inserted = 0;

        for (MenuItem m : seedItems) {
            final String k = key(m.getItemType(), m.getName());
            if (existing.containsKey(k)) {
                continue; // already in DB
            }
            menuItemRepository.save(m);
            inserted++;
        }

        log.info("Menu seeding finished. Inserted {} new items. Total items now = {}",
            inserted, menuItemRepository.count());
    }

    private static String key(final ItemType type, final String name) {
        final String t = (type == null) ? "NULL" : type.name();
        final String n = (name == null) ? "" : name.trim().toLowerCase();
        return t + "|" + n;
    }

    private MenuItem item(
        final Map<String, Ingredient> ingredientCache,
        final ItemType itemType,
        final String name,
        final String description,
        final String price,
        final String costToProduce,
        final Integer calories,
        final String allergensCsv,
        final boolean available,
        final String imageUrl,
        final List<String> filters,
        final List<String> ingredientNames
    ) {
        final MenuItem m = new MenuItem();
        m.setItemType(itemType);
        m.setName(name);
        m.setDescription(description);
        m.setPrice(new BigDecimal(price));
        m.setCostToProduce(new BigDecimal(costToProduce));
        m.setCalories(calories);
        m.setAllergens(allergensCsv);
        m.setAvailable(available);
        m.setImageUrl(imageUrl);

        applyFilters(m, filters);
        attachIngredients(m, ingredientCache, ingredientNames);

        return m;
    }

    private void attachIngredients(final MenuItem item,
                                   final Map<String, Ingredient> ingredientCache,
                                   final List<String> ingredientNames) {
        if (ingredientNames == null) return;

        for (String rawName : ingredientNames) {
            if (rawName == null) continue;

            final String name = rawName.trim();
            if (name.isEmpty()) continue;

            final String cacheKey = name.toLowerCase();

            final Ingredient ing = ingredientCache.computeIfAbsent(cacheKey, k ->
                ingredientRepository.findByNameIgnoreCase(name)
                    .orElseGet(() -> {
                        final Ingredient created = new Ingredient();
                        created.setName(name);
                        return ingredientRepository.save(created);
                    })
            );

            item.getIngredients().add(ing);
        }
    }

    private void applyFilters(final MenuItem item, final List<String> filters) {
        item.setVegetarian(false);
        item.setVegan(false);
        item.setGlutenFree(false);
        item.setMeat(false);

        if (filters == null) return;

        for (String f : filters) {
            if (f == null) continue;

            switch (f) {
                case "Vegetarian" -> item.setVegetarian(true);
                case "Vegan" -> item.setVegan(true);
                case "GlutenFree" -> item.setGlutenFree(true);
                case "Meat" -> item.setMeat(true);
                default -> { /* ignore UI-only labels like "Meat" */ }
            }
        }
    }
}
