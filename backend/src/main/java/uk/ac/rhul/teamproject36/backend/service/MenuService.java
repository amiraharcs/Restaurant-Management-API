package uk.ac.rhul.teamproject36.backend.service;

import org.springframework.stereotype.Service;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public final class MenuService {

    /** The repository for menu item data access. */
    private final MenuItemRepository menuItemRepository;

    /**
     * Constructs a new MenuService with the given repository.
     *
     * @param repository the menu item repository
     */
    public MenuService(final MenuItemRepository repository) {
        this.menuItemRepository = repository;
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
            String allergens
    ) {
        static MenuItemDto from(final MenuItem item) {
            return new MenuItemDto(
                    item.getName(),
                    item.getDescription(),
                    item.getPrice(),
                    item.getCalories(),
                    item.getAllergens()
            );
        }
    }
}
