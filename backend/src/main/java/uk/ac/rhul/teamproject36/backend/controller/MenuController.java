package uk.ac.rhul.teamproject36.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.teamproject36.backend.service.MenuService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/menu")
    public List<MenuService.MenuItemDto> getMenu() {
        return menuService.getMenuForCustomers();
    }
}
