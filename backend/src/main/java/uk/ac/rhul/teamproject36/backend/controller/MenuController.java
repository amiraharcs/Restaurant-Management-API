package uk.ac.rhul.teamproject36.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.backend.service.MenuService;

import java.util.List;

@RestController
@RequestMapping("/api")
public final class MenuController {

    /** The menu service for handling menu operations. */
    private final MenuService menuService;

    /**
     * Constructs a new MenuController with the given menu service.
     *
     * @param service the menu service
     */
    public MenuController(final MenuService service) {
        this.menuService = service;
    }

    /**
     * Returns the menu items available for customers.
     *
     * @return a list of menu item DTOs
     */
    @GetMapping("/menu")
    public List<MenuService.MenuItemDto> getMenu() {
        return menuService.getMenuForCustomers();
    }
}
