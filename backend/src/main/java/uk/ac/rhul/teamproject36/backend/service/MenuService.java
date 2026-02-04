package uk.ac.rhul.teamproject36.backend.service;

import org.springframework.stereotype.Service;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.repository.MenuItemRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItemDto> getMenuForCustomers() {
        return menuItemRepository.findByAvailableTrue()
                .stream()
                .map(MenuItemDto::from)
                .toList();
    }

    public record MenuItemDto(
            String name,
            String description,
            BigDecimal price,
            Integer calories,
            String allergens
    ) {
        static MenuItemDto from(MenuItem item) {
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
