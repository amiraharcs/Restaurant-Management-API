package uk.ac.rhul.teamproject36.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;

import uk.ac.rhul.teamproject36.backend.menu.ItemType;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuRepository;

@Service
public final class MenuService {

    /** Default item type if DB has null. */
    private static final ItemType DEFAULT_ITEM_TYPE = ItemType.FOOD;

    /** The repository for menu item data access. */
    private final MenuItemRepository menuItemRepository;

    /** The repository for filtered menu queries. */
    private final MenuRepository menuRepository;

    /**
     * Constructs a new MenuService with the given repositories.
     *
     * @param repository the menu item repository
     * @param menuRepositoryParam the menu repository for filtering
     */
    public MenuService(final MenuItemRepository repository,
                       final MenuRepository menuRepositoryParam) {
        this.menuItemRepository = repository;
        this.menuRepository = menuRepositoryParam;
    }

    /**
     * Returns menu items available for customers, grouped by item type.
     *
     * @return grouped menu items
     */
    public Map<String, List<MenuItemDto>> getMenuGroupedForCustomers() {
        return group(menuItemRepository.findByAvailableTrue());
    }

    /**
     * Returns filtered menu items for customers, grouped by item type.
     *
     * @param itemType filter by item type
     * @param vegetarian filter vegetarian items
     * @param halal filter halal items
     * @param vegan filter vegan items
     * @param glutenFree filter gluten-free items
     * @param maxCalories maximum calories
     * @param allergen allergen filter (string)
     * @return grouped filtered menu items
     */
    public Map<String, List<MenuItemDto>> getFilteredMenuGrouped(
            final ItemType itemType,
            final List<String> filters,
            final Integer maxCalories,
            final String allergen) {

        final boolean vegetarian =
                filters != null && filters.contains("is_vegetarian");

        final boolean halal =
                filters != null && filters.contains("is_halal");

        final boolean vegan =
                filters != null && filters.contains("is_vegan");

        final boolean glutenFree =
                filters != null && filters.contains("is_gluten_free");

        final List<MenuItem> items =
                menuRepository.findFiltered(
                        itemType,
                        vegetarian,
                        halal,
                        maxCalories,
                        allergen);

        return group(items);
    }


    /**
     * Builds a list of active filter names based on Boolean values.
     *
     * @param vegetarian vegetarian flag
     * @param halal halal flag
     * @param vegan vegan flag
     * @param glutenFree gluten-free flag
     * @return list of active filter names
     */
    private List<String> buildActiveFilters(
            final Boolean vegetarian,
            final Boolean halal,
            final Boolean vegan,
            final Boolean glutenFree) {

        final List<String> filters = new ArrayList<>();

        if (Boolean.TRUE.equals(vegetarian)) {
            filters.add("is_vegetarian");
        }

        if (Boolean.TRUE.equals(halal)) {
            filters.add("is_halal");
        }

        if (Boolean.TRUE.equals(vegan)) {
            filters.add("is_vegan");
        }

        if (Boolean.TRUE.equals(glutenFree)) {
            filters.add("is_gluten_free");
        }

        return filters;
    }

    private Map<String, List<MenuItemDto>> group(final List<MenuItem> items) {
        final Map<ItemType, List<MenuItemDto>> grouped =
                new EnumMap<>(ItemType.class);

        for (ItemType type : ItemType.values()) {
            grouped.put(type, new ArrayList<>());
        }

        for (MenuItem item : items) {
            final ItemType type =
                    item.getItemType() == null
                            ? DEFAULT_ITEM_TYPE
                            : item.getItemType();

            grouped.get(type).add(MenuItemDto.from(item));
        }

        final Map<String, List<MenuItemDto>> out =
                new LinkedHashMap<>();

        out.put(ItemType.FOOD.name(), grouped.get(ItemType.FOOD));
        out.put(ItemType.DESSERT.name(), grouped.get(ItemType.DESSERT));
        out.put(ItemType.DRINK.name(), grouped.get(ItemType.DRINK));

        return out;
    }

    /**
     * Data transfer object for menu items (frontend contract).
     *
     * @param id the item id
     * @param name the item name
     * @param description the item description
     * @param price the item price
     * @param calories the calorie count
     * @param isAvailable availability flag
     * @param ingredients list of ingredient names
     * @param allergens list of allergen names
     * @param filters list of filters
     * @param image image url
     * @param itemType the item type
     */
    public record MenuItemDto(
            Long id,
            String name,
            String description,
            BigDecimal price,
            Integer calories,
            boolean isAvailable,
            List<String> ingredients,
            List<String> allergens,
            List<String> filters,
            String image,
            String itemType) {

        static MenuItemDto from(final MenuItem item) {
            return new MenuItemDto(
                    item.getId(),
                    item.getName(),
                    item.getDescription(),
                    item.getPrice(),
                    item.getCalories(),
                    item.isAvailable(),
                    item.getIngredients()
                    .stream()
                    .map(ingredient -> ingredient.getName())
                    .toList(),
                    splitCsv(item.getAllergens()),
                    buildFilters(item),
                    item.getImageUrl(),
                    item.getItemType() == null
                            ? DEFAULT_ITEM_TYPE.name()
                            : item.getItemType().name());
        }

        private static List<String> splitCsv(final String raw) {
            if (raw == null || raw.isBlank()) {
                return List.of();
            }

            return Arrays.stream(raw.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }

        private static List<String> buildFilters(final MenuItem item) {

            final List<String> filters = new ArrayList<>();

            final boolean vegetarian = item.isVegetarian();
            final boolean vegan = item.isVegan();

            // Frontend expects: Vegetarian / Vegan / GlutenFree / Halal / Meat
            if (vegan) {
                filters.add("Vegan");
                // Many frontends treat vegan as vegetarian as well
                if (!vegetarian) {
                    filters.add("Vegetarian");
                }
            } else if (vegetarian) {
                filters.add("Vegetarian");
            } else {
                // Not vegetarian and not vegan => Meat
                filters.add("Meat");
            }

            if (item.isGlutenFree()) {
                filters.add("GlutenFree");
            }

            if (item.isHalal()) {
                filters.add("Halal");
            }

            return filters;
        }
    }

    /**
     * Updates the availability of a menu item.
     *
     * @param id the menu item id
     * @param available the new availability value
     * @throws EntityNotFoundException if the item does not exist
     */
    public void updateAvailability(final Long id,
                                   final boolean available) {

        final MenuItem item =
                menuItemRepository.findById(id)
                        .orElseThrow(() ->
                                new EntityNotFoundException("Menu item not found"));

        item.setAvailable(available);
        menuItemRepository.save(item);
    }

    public MenuItem getMenuItembyId(Long id) {
        MenuItem item = menuItemRepository.findById(id).orElseThrow(() -> new RuntimeException("customer not found"));

        return item;
    }
}
