package uk.ac.rhul.teamproject36.backend.service;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;
import uk.ac.rhul.teamproject36.backend.repository.MenuRepository;

@Service
public final class MenuService {

    /** The repository for menu item data access. */
    private final MenuItemRepository menuItemRepository;

    /** The repository for filtered menu queries. */
    private final MenuRepository menuRepository;

    /**
     * Constructs a new MenuService with the given repositories.
     *
     * @param repository the menu item repository
     * @param menuRepository the menu repository for filtering
     */
    public MenuService(final MenuItemRepository repository, final MenuRepository menuRepository) {
        this.menuItemRepository = repository;
      this.menuRepository = menuRepository;
    }

    /**
     * Returns a list of menu items available for customers.
     *
     * @return a list of menu item DTOs
     */
    public List<MenuItemDto> getMenuForCustomers() {
        return menuItemRepository.findByAvailableTrue()
                .stream()
                .map(MenuItemDto::from)
                .toList();
    }

    /**
     * Returns filtered menu items for customers.
     *
     * @param category filter by category
     * @param vegetarian filter vegetarian items
     * @param glutenFree filter gluten-free items
     * @return filtered list of menu item DTOs
     */
    public List<MenuItemDto> getFilteredMenu(String category, Boolean vegetarian,
        Boolean glutenFree, Integer maxCalories, String allergen) {
      return menuRepository.findFiltered(category, vegetarian, glutenFree, maxCalories, allergen)
          .stream().map(MenuItemDto::from).toList();
    }

    /**
     * Data transfer object for menu items.
     *
     * @param name the item name
     * @param description the item description
     * @param price the item price
     * @param calories the calorie count
     * @param allergens the allergens
     */
    public record MenuItemDto(
            String name,
            String description,
            BigDecimal price,
            Integer calories,
            String allergens) {
        static MenuItemDto from(final MenuItem item) {
            return new MenuItemDto(
                    item.getName(),
                    item.getDescription(),
                    item.getPrice(),
                    item.getCalories(),
                    item.getAllergens());
        }
    }

    /**
     * Updates the availability of a menu item.
     *
     * @param id the menu item id
     * @param available the new availability value
     * @throws EntityNotFoundException if the item does not exist
     */
    public void updateAvailability(final Long id, final boolean available) {
      final MenuItem item = menuItemRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException("Menu item not found"));

      item.setAvailable(available);
      menuItemRepository.save(item);
    }
}
