package uk.ac.rhul.teamproject36.backend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;
import uk.ac.rhul.teamproject36.backend.menu.MenuItem;
import uk.ac.rhul.teamproject36.backend.service.MenuService;

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
     * Returns the menu items available to customers, with optional filters.
     *
     * @param itemType filter by item type (optional)
     * @param vegetarian show only vegetarian items (optional)
     * @param halal show only halal items (optional)
     * @param vegan show only vegan items (optional)
     * @param glutenFree show only gluten-free items (optional)
     * @param maxCalories maximum calories filter (optional)
     * @param allergen allergen filter (optional)
     * @return filtered list of available menu items
     */
    @GetMapping("/menu")
    public java.util.Map<String, List<MenuService.MenuItemDto>> getMenu(
    	    @RequestParam(required = false, name = "item_type")
    	    final uk.ac.rhul.teamproject36.backend.menu.ItemType itemType,
    	    @RequestParam(required = false) final List<String> filters,
    	    @RequestParam(required = false) final Integer maxCalories,
    	    @RequestParam(required = false) final String allergen) {

    	    if (itemType != null
    	        || filters != null
    	        || maxCalories != null
    	        || allergen != null) {

    	        return menuService.getFilteredMenuGrouped(
    	            itemType,
    	            filters,
    	            maxCalories,
    	            allergen);
    	    }

    	    return menuService.getMenuGroupedForCustomers();
    	}
    /**
     * Request body for updating a menu item's availability.
     */
    public static final class AvailabilityUpdateRequest {

        private Boolean is_available;

        public Boolean getAvailable() {
            return is_available;
        }

        public void setAvailable(final Boolean available) {
            this.is_available = available;
        }
    }

    /**
     * Updates the availability of a menu item.
     *
     * @param id the menu item id
     * @param request the availability update request body
     * @return HTTP status indicating the result
     */
    @PatchMapping("/menu/{id}/availability")
    public ResponseEntity<Void> updateAvailability(
            @PathVariable final Long id,
            @RequestBody final AvailabilityUpdateRequest request) {

        if (request == null || request.getAvailable() == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            menuService.updateAvailability(id, request.getAvailable());
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

        @GetMapping("/menu/menuItem/{id}")
        public ResponseEntity<MenuService.MenuItemDto> getMenuItemById(@PathVariable Long id) {

            MenuService.MenuItemDto item = menuService.getMenuItembyId(id);

            return ResponseEntity.ok(item);
        }

        @GetMapping("/menu/all")
        public ResponseEntity<List<MenuService.MenuItemDto>> getAllMenuItems() {

            List<MenuService.MenuItemDto> items = menuService.getAllMenuItems();

            return ResponseEntity.ok(items);
        }

}
